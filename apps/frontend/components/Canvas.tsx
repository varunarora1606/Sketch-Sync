"use client";
import useSize from "@/hooks/useSize";
import { useEffect, useRef, useState } from "react";
import ToolKit from "./ToolKit";

type Shape = "rect" | "circle" | "ellipse" | "square" | "pencil" | "line" | "selection" ;

interface Element {
  shape: Shape;
  dimension: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    points: { x: number; y: number }[];
  };
}

function Canvas({ roomId, ws }: { roomId: string; ws: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [shape, setShape] = useState<Shape>("selection");
  const [pan, setPan] = useState({ X: 0, Y: 0 });
  const [zoom, setZoom] = useState(1);

  const canvasSize = useSize();

  const screenToWorld = (screenX: number, screenY: number) => ({
    x: screenX / zoom + pan.X,
    y: screenY / zoom + pan.Y,
  });

  const worldToScreen = (worldX: number, worldY: number) => ({
    x: (worldX - pan.X) * zoom,
    y: (worldY - pan.Y) * zoom,
  });

  const draw = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    points: { x: number; y: number }[],
    shape: Shape
  ) => {
    const startScreen = worldToScreen(startX, startY);
    const endScreen = worldToScreen(endX, endY);

    const width = endScreen.x - startScreen.x;
    const height = endScreen.y - startScreen.y;
    const absWidth = Math.abs(width);
    const absHeight = Math.abs(height);
    ctx.lineWidth = 2 * zoom

    if (shape === "rect") {
      ctx.strokeRect(startScreen.x, startScreen.y, width, height);
    } else if (shape === "square") {
      const absSide = Math.max(absWidth, absHeight);
      ctx.strokeRect(
        startScreen.x,
        startScreen.y,
        Math.sign(width) * absSide,
        Math.sign(height) * absSide
      );
    } else if (shape === "ellipse") {
      const absRadiusX = absWidth / 2;
      const absRadiusY = absHeight / 2;
      const centerX = startScreen.x + Math.sign(width) * absRadiusX;
      const centerY = startScreen.y + Math.sign(height) * absRadiusY;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, absRadiusX, absRadiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape === "circle") {
      const absRadius = Math.max(absWidth, absHeight) / 2;
      const centerX = startScreen.x + Math.sign(width) * absRadius;
      const centerY = startScreen.y + Math.sign(height) * absRadius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, absRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
    } else if (shape === "pencil") {
      ctx.beginPath();
      ctx.moveTo(startScreen.x, startScreen.y);
      points.forEach(({ x, y }) => {
        const screenPoints = worldToScreen(x, y);
        ctx.lineTo(screenPoints.x, screenPoints.y);
      });
      ctx.stroke();
    }
  };

  const reDraw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,1)";

    elements.forEach((element) => {
      draw(
        ctx,
        element.dimension.startX,
        element.dimension.startY,
        element.dimension.endX,
        element.dimension.endY,
        element.dimension.points,
        element.shape
      );
    });
  };

  const roughness = (x: number, y: number) => {
    return { x: x + Math.random() * 2 - 1, y: y + Math.random() * 2 - 1 };
  };

  useEffect(() => {
    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      switch (type) {
        case "CHAT":
          setElements((prev) => [
            ...prev,
            {
              shape: payload.message.shape,
              dimension: {
                startX: payload.message.dimension.startX,
                startY: payload.message.dimension.startY,
                endX: payload.message.dimension.endX,
                endY: payload.message.dimension.endY,
                points: payload.message.dimension.points,
              },
            },
          ]);
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
    let points: { x: number; y: number }[] = [];

    const handleMouseDown = (e: MouseEvent) => {
      isDrawing = true;
      startX = e.pageX;
      startY = e.pageY;
      points = [];
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;

      reDraw(ctx, canvas);

      const endX = e.pageX;
      const endY = e.pageY;
      const startWorld = screenToWorld(startX, startY);
      const endWorld = screenToWorld(endX, endY);
      if (shape === "pencil") {
        points.push({ x: endWorld.x + Math.random() * 2 - 1, y: endWorld.y + Math.random() * 2 - 1});
      }
      draw(
        ctx,
        startWorld.x,
        startWorld.y,
        endWorld.x,
        endWorld.y,
        points,
        shape
      );
    };

    const handleMouseUpAndOut = (e: MouseEvent) => {
      const endX = e.pageX;
      const endY = e.pageY;
      const startWorld = screenToWorld(startX, startY);
      const endWorld = screenToWorld(endX, endY);
      const message = {
        shape,
        dimension: {
          startX: startWorld.x,
          startY: startWorld.y,
          endX: endWorld.x,
          endY: endWorld.y,
          points: points,
        },
      };
      setElements((prev) => [...prev, message]);
      ws.send(
        JSON.stringify({
          type: "CHAT",
          payload: { message, roomId },
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

    let lastScrollTime = 0;
    const scrollThrottle = 16; // ~60fps
    const minScrollDelta = 0;
    const scaleFactor = 0.9;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = performance.now();
      if (now - lastScrollTime < scrollThrottle) return;
      lastScrollTime = now;
      if (
        Math.abs(e.deltaX) < minScrollDelta &&
        Math.abs(e.deltaY) < minScrollDelta
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        // Handle pinch-to-zoom separately
        if ((zoom < 0.1 && e.deltaY > 0) || (zoom > 30 && e.deltaY < 0)) return;
        const newZoom = zoom + -e.deltaY * (zoom * 0.01); //for fast zoom at higher zoom levels
        const zoomFactor = newZoom / zoom;

        // Bcoz earlier calculation was startX = e.pageX + (element.startX - e.pageX) * zoomFactor,
        // And now looking using windowToScreen and Pan we get formula :
        // startX = (worldX + pan) * zoom
        //        = element.startX * zoomFactor - (pan * zoom)
        //        = element.startX * zoomFactor - (e.pageX * (zoomFactor - 1) / newZoom * zoom)
        //        = element.startY * zoomFactor + e.pageX * (zoomFactor - 1)
        setPan((prev) => ({
          X: prev.X + (e.pageX * (zoomFactor - 1)) / newZoom,
          Y: prev.Y + (e.pageY * (zoomFactor - 1)) / newZoom,
        }));
        setZoom(newZoom);
      } else {
        // Throttle scroll events
        const deltaX = e.deltaX * scaleFactor;
        const deltaY = e.deltaY * scaleFactor;

        setPan((prev) => ({
          X: prev.X + deltaX / zoom,
          Y: prev.Y + deltaY / zoom,
        }));
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUpAndOut);
    canvas.addEventListener("mouseout", handleMouseUpAndOut);
    // window.addEventListener("keydown", handleShiftDown);
    // window.addEventListener("keyup", handleShiftUp);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUpAndOut);
      canvas.removeEventListener("mouseout", handleMouseUpAndOut);
      // window.removeEventListener("keydown", handleShiftDown);
      // window.removeEventListener("keyup", handleShiftUp);
    };
  }, [elements, canvasSize, zoom, pan, shape]);

  return (
    <>
      <div className="relative">
        <div className="fixed w-full h-full left-0 top-0">
          <canvas
            ref={canvasRef}
            height={canvasSize?.height || 0}
            width={canvasSize?.width || 0}
          />
          ;
        </div>
        <div className="fixed left-0 top-10">
          <ToolKit setShape={setShape} />
        </div>
      </div>
    </>
  );
}

export default Canvas;
