import { RealtimeEventName, RealtimeMessage } from "../../core/types/events.types";
import { getSupabaseClient } from "../../services/supabase/supabase-client";

type EventListener<T extends RealtimeEventName = RealtimeEventName> = (
  message: RealtimeMessage<T>
) => void;

const globalForBus = globalThis as unknown as {
  chaosEventBus: RealtimeEventBus | undefined;
};

export class RealtimeEventBus {
  private static instance: RealtimeEventBus;
  private listeners: Map<string, Set<EventListener>> = new Map();

  private constructor() {}

  public static getInstance(): RealtimeEventBus {
    if (!globalForBus.chaosEventBus) {
      globalForBus.chaosEventBus = new RealtimeEventBus();
    }
    return globalForBus.chaosEventBus;
  }

  /**
   * Subscribe to events for a specific room.
   */
  public subscribe(roomCode: string, listener: EventListener): () => void {
    const code = roomCode.toUpperCase();
    if (!this.listeners.has(code)) {
      this.listeners.set(code, new Set());
    }
    this.listeners.get(code)!.add(listener);

    return () => {
      const roomListeners = this.listeners.get(code);
      if (roomListeners) {
        roomListeners.delete(listener);
        if (roomListeners.size === 0) {
          this.listeners.delete(code);
        }
      }
    };
  }

  /**
   * Publish an event to all subscribers of a room (both local memory and Supabase Realtime broadcast).
   */
  public publish<T extends RealtimeEventName>(
    roomCode: string,
    type: T,
    payload: RealtimeMessage<T>["payload"]
  ): void {
    const code = roomCode.toUpperCase();
    const message: RealtimeMessage<T> = {
      type,
      payload,
      roomCode: code,
      timestamp: Date.now(),
    };

    // 1. Dispatch to local in-memory listeners
    const roomListeners = this.listeners.get(code);
    if (roomListeners && roomListeners.size > 0) {
      for (const listener of roomListeners) {
        try {
          listener(message as unknown as RealtimeMessage<RealtimeEventName>);
        } catch (err) {
          console.error(`[EventBus] Error in local listener for room ${code}:`, err);
        }
      }
    }

    // 2. Broadcast via Supabase Realtime Channel for multi-instance / serverless cross-node sync
    try {
      const supabase = getSupabaseClient();
      supabase
        .channel(`room:${code}`)
        .send({
          type: "broadcast",
          event: type,
          payload,
        })
        .catch((err) => {
          // Non-fatal if Supabase is offline; local bus already succeeded
          console.warn(`[EventBus] Supabase broadcast notice:`, err?.message || err);
        });
    } catch {
      // Ignore background broadcast failures in local offline dev
    }
  }
}

