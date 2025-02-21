"use client";
import { useEffect, useRef, useState } from "react";

function Canvas({ roomId, ws }: { roomId: string; ws: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<
    { startX: number; startY: number; endX: number; endY: number }[]
  >([]);

  const [canvasSize, setCanvasSize] = useState<{width: number; height: number}>();
  useEffect(() => {
    if(!canvasSize) {
        setCanvasSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
    }
    const handleResize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const reDraw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,1)";
    elements.forEach(({ startX, startY, endX, endY }) => {
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    });
  };

  useEffect(() => {
    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      switch (type) {
        case "CHAT":
          setElements((prev) => [...prev, payload.message]);
          break;
        default:
          break;
      }
    };
    return () => {};
  }, [ws]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    reDraw(ctx, canvas);

    let startX: number;
    let startY: number;
    let isDrawing = false;

    const handleMouseDown = (e: MouseEvent) => {
      console.log(elements);
      isDrawing = true;
      startX = e.pageX;
      startY = e.pageY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;

      reDraw(ctx, canvas);

      ctx.strokeRect(startX, startY, e.pageX - startX, e.pageY - startY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      console.log(elements);

      const message = { startX, startY, endX: e.pageX, endY: e.pageY };
      setElements((prev) => [...prev, message]);
      ws.send(
        JSON.stringify({
          type: "CHAT",
          payload: {
            message,
            roomId,
          },
        })
      );
      isDrawing = false;
      // ctx.strokeRect(startX, startY, e.pageX - startX, e.pageY - startY);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [elements, canvasSize]);

  return (
    <>
      <canvas
        ref={canvasRef}
        height={canvasSize?.height || 0}
        width={canvasSize?.width || 0}
      />
    </>
  );
}

export default Canvas;
