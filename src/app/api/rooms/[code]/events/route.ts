import { RealtimeEventBus } from "../../../../../backend/events/event-bus";
import { RealtimeMessage } from "../../../../../core/types/events.types";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const roomCode = code.toUpperCase();
  const bus = RealtimeEventBus.getInstance();

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Send initial ping to keep-alive
  writer.write(encoder.encode(`event: connected\ndata: ${JSON.stringify({ roomCode, time: Date.now() })}\n\n`));

  const unsubscribe = bus.subscribe(roomCode, (message: RealtimeMessage) => {
    try {
      const data = `event: ${message.type}\ndata: ${JSON.stringify(message.payload)}\n\n`;
      writer.write(encoder.encode(data));
    } catch {
      unsubscribe();
    }
  });

  // Keep connection open with heartbeat every 15s
  const heartbeat = setInterval(() => {
    try {
      writer.write(encoder.encode(`: ping\n\n`));
    } catch {
      clearInterval(heartbeat);
      unsubscribe();
    }
  }, 15000);

  req.signal.addEventListener("abort", () => {
    clearInterval(heartbeat);
    unsubscribe();
    try {
      writer.close();
    } catch {
      // Ignored
    }
  });

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
