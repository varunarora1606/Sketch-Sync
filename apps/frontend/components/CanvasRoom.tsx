"use client";
import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import { WS_Url } from "@/app/config";

function CanvasRoom({ roomId }: { roomId: string }) {
  const socket = useRef<WebSocket>(null);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const ws = new WebSocket(`${WS_Url}`);
    socket.current = ws
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "SUBSCRIBE",
          payload: {
            roomId,
          },
        })
      );
    };

    ws.onclose = () => {
      socket.current = null;
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "UNSUBSCRIBE",
            payload: { roomId },
          })
        );
        ws.close();
      }
    };
  }, []);

  if (!isClient) return null;

  if (socket.current) {
    return <Canvas roomId={roomId} ws={socket.current} />;
  }
  return <div>Loading ...</div>;
}

export default CanvasRoom;
