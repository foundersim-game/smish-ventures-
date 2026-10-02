import { RealtimeEventName, RealtimeMessage } from "../../core/types/events.types";

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
    if (!this.listeners.has(roomCode)) {
      this.listeners.set(roomCode, new Set());
    }
    this.listeners.get(roomCode)!.add(listener);

    return () => {
      const roomListeners = this.listeners.get(roomCode);
      if (roomListeners) {
        roomListeners.delete(listener);
        if (roomListeners.size === 0) {
          this.listeners.delete(roomCode);
        }
      }
    };
  }

  /**
   * Publish an event to all subscribers of a room.
   */
  public publish<T extends RealtimeEventName>(
    roomCode: string,
    type: T,
    payload: RealtimeMessage<T>["payload"]
  ): void {
    const roomListeners = this.listeners.get(roomCode);
    if (!roomListeners || roomListeners.size === 0) {
      return;
    }

    const message: RealtimeMessage<T> = {
      type,
      payload,
      roomCode,
      timestamp: Date.now(),
    };

    for (const listener of roomListeners) {
      try {
        listener(message as unknown as RealtimeMessage<RealtimeEventName>);
      } catch (err) {
        console.error(`[EventBus] Error in listener for room ${roomCode}:`, err);
      }
    }
  }
}
