"use client";
import useSize from "@/hooks/useSize";
import { useEffect, useRef, useState } from "react";

type Shape = "rect" | "circle" | "ellipse" | "square";

function Canvas({ roomId, ws }: { roomId: string; ws: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<
    { startX: number; startY: number; endX: number; endY: number }[]
  >([]);
  const [shape, setShape] = useState<Shape>("rect");

  const canvasSize = useSize();

  const draw = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    shape: Shape
  ) => {
    const width = endX - startX;
    const height = endY - startY;
    const absWidth = Math.abs(width);
    const absHeight = Math.abs(height);
    if (shape === "rect") {
      ctx.strokeRect(startX, startY, width, height);
    } else if (shape === "square") {
      const absSide = Math.max(absWidth, absHeight);
      ctx.strokeRect(
        startX,
        startY,
        Math.sign(width) * absSide,
        Math.sign(height) * absSide
      );
    } else if (shape === "ellipse") {
      const absRadiusX = absWidth / 2;
      const absRadiusY = absHeight / 2;
      const centerX = startX + Math.sign(width) * absRadiusX;
      const centerY = startY + Math.sign(height) * absRadiusY;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, absRadiusX, absRadiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape === "circle") {
      const absRadius = Math.max(absWidth, absHeight) / 2;
      const centerX = startX + Math.sign(width) * absRadius;
      const centerY = startY + Math.sign(height) * absRadius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, absRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
    }
  };

  const reDraw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,1)";
    console.log("hello");
    elements.forEach(({ startX, startY, endX, endY }) => {
      draw(ctx, startX, startY, endX, endY, shape);
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

      const endX = e.pageX;
      const endY = e.pageY;
      draw(ctx, startX, startY, endX, endY, shape);
    };

    const handleMouseUp = (e: MouseEvent) => {
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
    };

    // const handleShiftDown = (e: KeyboardEvent) => {
    //   console.log("e");
    //   if (!isDrawing) return;
    //   if (shape === "circle" || shape === "ellipse") {
    //     setShape("circle");
    //   } else if (shape === "square" || shape === "rect") {
    //     setShape("square");
    //   }
    //   console.log("pressed", e);
    // };
    // const handleShiftUp = (e: KeyboardEvent) => {
    //   console.log("e");
    //   console.log("lifted", e);
    //   if (!isDrawing) return;
    //   if (shape === "circle" || shape === "ellipse") {
    //     setShape("ellipse");
    //   } else if (shape === "square" || shape === "rect") {
    //     setShape("rect");
    //   }
    // };

    const handleTwoFingerScroll = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        console.log("Pinch-to-zoom detected!");
        return;
      }
      console.log(e);
      if (Math.abs(e.deltaX) < 10 && Math.abs(e.deltaY) < 10) return;
      const newElements = elements.map((element) => {
        console.log(element.startX - e.deltaX);
        element.startX = element.startX - e.deltaX/180;
        element.startY = element.startY - e.deltaY/180;
        element.endX = element.endX - e.deltaX/180;
        element.endY = element.endY - e.deltaY/180;
        return element;
      });
      setElements(newElements);
      reDraw(ctx, canvas);
      console.log(
        `Two-finger scroll: DeltaY = ${e.deltaY}, DeltaX = ${e.deltaX}`
      );
    };

    window.addEventListener("wheel", handleTwoFingerScroll, { passive: false });

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    // window.addEventListener("keydown", handleShiftDown);
    // window.addEventListener("keyup", handleShiftUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      // window.removeEventListener("keydown", handleShiftDown);
      // window.removeEventListener("keyup", handleShiftUp);
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
