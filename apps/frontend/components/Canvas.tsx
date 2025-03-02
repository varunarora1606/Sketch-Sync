"use client";
import useSize from "@/hooks/useSize";
import { useEffect, useRef, useState } from "react";
import ToolKit from "./ToolKit";
import { Element, Shape } from "@/types";

type CurrentShape = Shape | "circle" | "square";



// TODO: erasor And improve drag by filter

function Canvas({ roomId, ws }: { roomId: string; ws: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [shape, setShape] = useState<Shape>("selection");
  const [pan, setPan] = useState({ X: 0, Y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isSelected, setIsSelected] = useState<Element | null>();
  const [newSelectedElem, setNewSelectedElem] = useState<Element | null>(null);
  const [initialSelectPnt, setInitialSelectPnt] = useState<{
    x: number;
    y: number;
  } | null>();

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
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    points: { x: number; y: number }[],
    currentShape: CurrentShape
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startScreen = worldToScreen(startX, startY);
    const endScreen = worldToScreen(endX, endY);

    const width = endScreen.x - startScreen.x;
    const height = endScreen.y - startScreen.y;
    const absWidth = Math.abs(width);
    const absHeight = Math.abs(height);
    ctx.lineWidth = 2 * zoom;

    ctx.beginPath();
    if (currentShape === "rect") {
      ctx.strokeRect(startScreen.x, startScreen.y, width, height);
    } else if (currentShape === "square") {
      const absSide = Math.max(absWidth, absHeight);
      ctx.strokeRect(
        startScreen.x,
        startScreen.y,
        Math.sign(width) * absSide,
        Math.sign(height) * absSide
      );
    } else if (currentShape === "ellipse") {
      const absRadiusX = absWidth / 2;
      const absRadiusY = absHeight / 2;
      const centerX = startScreen.x + Math.sign(width) * absRadiusX;
      const centerY = startScreen.y + Math.sign(height) * absRadiusY;
      ctx.ellipse(centerX, centerY, absRadiusX, absRadiusY, 0, 0, Math.PI * 2);
    } else if (currentShape === "circle") {
      const absRadius = Math.max(absWidth, absHeight) / 2;
      const centerX = startScreen.x + Math.sign(width) * absRadius;
      const centerY = startScreen.y + Math.sign(height) * absRadius;
      ctx.arc(centerX, centerY, absRadius, 0, Math.PI * 2);
    } else if (currentShape === "pencil") {
      ctx.lineWidth = 4 * zoom;
      points.forEach(({ x, y }) => {
        const screenPoints = worldToScreen(x, y);
        ctx.lineTo(screenPoints.x, screenPoints.y);
      });
    } else if (currentShape === "line") {
      ctx.moveTo(startScreen.x, startScreen.y);
      ctx.lineTo(endScreen.x, endScreen.y);
    }
    // ctx.closePath();
    ctx.stroke();
  };

  const selectDraw = (element: Element) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startScreen = worldToScreen(
      element.dimension.startX,
      element.dimension.startY
    );
    const endScreen = worldToScreen(
      element.dimension.endX,
      element.dimension.endY
    );
    let width = endScreen.x - startScreen.x;
    let height = endScreen.y - startScreen.y;
    let st;
    let end;
    if (width > 0) {
      st = startScreen.x - 5;
      width += 10;
    } else {
      st = startScreen.x + 5;
      width -= 10;
    }
    if (height > 0) {
      end = startScreen.y - 5;
      height += 10;
    } else {
      end = startScreen.y + 5;
      height -= 10;
    }
    ctx.strokeStyle = "#B4B0FF";
    ctx.fillStyle = "#B4B0FF";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(st, end, 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(st + width, end, 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(st, end + height, 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(st + width, end + height, 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.strokeRect(st, end, width, height);
    ctx.strokeRect(st, end, width, height);
    ctx.stroke();
    ctx.strokeStyle = "white";
  };

  const reDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,1)";

    elements.forEach((element) => {
      if (element == newSelectedElem && shape == "selection") {
        selectDraw(element);
      }
      draw(
        element.dimension.startX,
        element.dimension.startY,
        element.dimension.endX,
        element.dimension.endY,
        element.dimension.points,
        element.shape
      );
    });
  };

  function isOnBorder(element: Element, x: number, y: number): boolean {
    const tolerance = 6; // Adjust as needed
    const startScreen = worldToScreen(
      element.dimension.startX,
      element.dimension.startY
    );
    const endScreen = worldToScreen(
      element.dimension.endX,
      element.dimension.endY
    );

    function isInBetween(number: number, num1: number, num2: number) {
      return (
        number >= Math.min(num1, num2) - tolerance &&
        number <= Math.max(num1, num2) + tolerance
      );
    }

    const isBetween = (val: number, target: number, range: number) =>
      Math.abs(val - target) <= range;

    function isPointOnLine(
      pointX: number,
      pointY: number,
      lineStartX: number,
      lineStartY: number,
      lineEndX: number,
      lineEndY: number
    ) {
      // Calculate the distance between the point and the line
      const dx = lineEndX - lineStartX;
      const dy = lineEndY - lineStartY;

      if (dx === 0 && dy === 0) {
        // Line is a point
        return (
          Math.abs(pointX - lineStartX) < tolerance &&
          Math.abs(pointY - lineStartY) < tolerance
        );
      }

      const t =
        ((pointX - lineStartX) * dx + (pointY - lineStartY) * dy) /
        (dx * dx + dy * dy);

      if (t < 0 || t > 1) {
        // Point is outside the line segment
        const distToStart = Math.sqrt(
          (pointX - lineStartX) ** 2 + (pointY - lineStartY) ** 2
        );
        const distToEnd = Math.sqrt(
          (pointX - lineEndX) ** 2 + (pointY - lineEndY) ** 2
        );
        return Math.min(distToStart, distToEnd) < tolerance; // Check distance to endpoints
      }

      const closestX = lineStartX + t * dx;
      const closestY = lineStartY + t * dy;

      const distance = Math.sqrt(
        (pointX - closestX) ** 2 + (pointY - closestY) ** 2
      );

      return distance < tolerance;
    }

    if (
      !(
        isInBetween(x, startScreen.x, endScreen.x) &&
        isInBetween(y, startScreen.y, endScreen.y)
      )
    ) {
      return false;
    }

    if (element === newSelectedElem) {
      return true;
    }

    switch (element.shape) {
      case "rect":
      case "square":
        return (
          ((isInBetween(startScreen.x - x, 3, -3) ||
            isInBetween(endScreen.x - x, 3, -3)) &&
            isInBetween(y, startScreen.y, endScreen.y)) ||
          ((isInBetween(startScreen.y - y, 3, -3) ||
            isInBetween(endScreen.y - y, 3, -3)) &&
            isInBetween(x, startScreen.x, endScreen.x))
        );
      case "ellipse":
        const centerX = (startScreen.x + endScreen.x) / 2;
        const centerY = (startScreen.y + endScreen.y) / 2;
        const rx = Math.abs(endScreen.x - startScreen.x) / 2;
        const ry = Math.abs(endScreen.y - startScreen.y) / 2;

        if (rx === 0 || ry === 0) {
          return false;
        }

        const dx = x - centerX;
        const dy = y - centerY;

        const ellipseEquation = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);

        const distance = Math.abs(ellipseEquation - 1);
        return distance <= (tolerance / Math.max(rx, ry)) * 5; // Scale tolerance by ellipse size
      case "circle":
        const centerXCircle = (startScreen.x + endScreen.x) / 2;
        const centerYCircle = (startScreen.y + endScreen.y) / 2;
        const radiusCircle =
          Math.max(
            Math.abs(endScreen.x - startScreen.x),
            Math.abs(endScreen.y - startScreen.y)
          ) / 2;
        const dxCircle = x - centerXCircle;
        const dyCircle = y - centerYCircle;
        const distanceCircle = Math.sqrt(
          dxCircle * dxCircle + dyCircle * dyCircle
        );
        return isBetween(distanceCircle, radiusCircle, tolerance);
      case "pencil":
        const points = element.dimension.points;
        let startPoint = worldToScreen(points[0].x, points[0].y);
        return points.some((point) => {
          const pointScreen = worldToScreen(point.x, point.y);
          const ans = isPointOnLine(
            x,
            y,
            pointScreen.x,
            pointScreen.y,
            startPoint.x,
            startPoint.y
          );
          startPoint = pointScreen;
          return ans;
        });
      case "line":
        return isPointOnLine(
          x,
          y,
          startScreen.x,
          startScreen.y,
          endScreen.x,
          endScreen.y
        );
      default:
        return false;
    }
  }

  const sendWS = (type: string, message: any) => {
    ws.send(
      JSON.stringify({
        type,
        payload: { message, roomId },
      })
    );
  };

  useEffect(() => {
    ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      switch (type) {
        case "CHAT":
          setElements((prev) => [
            ...prev,
            {
              id: payload.message.id,
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
        case "TEMP_CHAT":
          const dimensions = payload.message.dimension;
          reDraw();
          draw(
            dimensions.startX,
            dimensions.startY,
            dimensions.endX,
            dimensions.endY,
            dimensions.points,
            payload.message.shape
          );
          break;
        case "UPDATE_ELEMENT":
          setElements(
            elements.map((element) => {
              if (element.id == payload.message.oldElement.id) {
                return payload.message.newElement;
              }
              return element;
            })
          );
          break;
        case "ERASE":
          setElements(
            elements.filter((element) => {
              return !payload.message.some((dltElm: Element) => {
                return dltElm.id === element.id;
              });
            })
          );
          break;
        default:
          break;
      }
    };
    return () => {};
  }, [ws, elements]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    reDraw();

    let startX: number;
    let startY: number;
    let isDrawing = false;
    let points: { x: number; y: number }[] = [];
    let currentShape: CurrentShape = shape;
    let startWorld: { x: number; y: number };
    let endWorld: { x: number; y: number };
    let erasedElements: Element[];
    let unErasedElements: Element[];
    let newElement: Element | null;

    const handleMouseDown = (e: MouseEvent) => {
      if (shape === "selection") {
        let isOnShape = false;
        elements.forEach((element) => {
          if (isOnBorder(element, e.pageX, e.pageY)) {
            isOnShape = true;
            canvas.style.cursor = "move";
            setIsSelected(element);
            setNewSelectedElem(element);
            setInitialSelectPnt(screenToWorld(e.pageX, e.pageY));
            return;
          }
        });
        if (!isOnShape) {
          canvas.style.cursor = "default";
          setIsSelected(null);
          setNewSelectedElem(null);
        }
        return;
      }
      isDrawing = true;
      startX = e.pageX;
      startY = e.pageY;
      points = [];
      erasedElements = [];
      unErasedElements = elements;
    };

    let lastMoveTime = 0;
    const MoveThrottle = 16; // ~60fps
    const handleMouseMove = (e: MouseEvent) => {
      if (shape === "selection" && !initialSelectPnt) {
        let isOnShape = false;
        elements.forEach((element) => {
          if (isOnBorder(element, e.pageX, e.pageY)) {
            isOnShape = true;
            canvas.style.cursor = "move";
            return;
          }
        });
        if (!isOnShape) canvas.style.cursor = "default";
      }
      if (shape === "eraser" && isDrawing) {
        unErasedElements = unErasedElements.filter((element) => {
          if (isOnBorder(element, e.pageX, e.pageY)) {
            erasedElements.push(element);
            return false;
          }
          return true;
        });
      }
      const now = performance.now();
      if (now - lastMoveTime < MoveThrottle) return;
      lastMoveTime = now;
      if (shape === "selection" && isSelected && initialSelectPnt) {
        const pos = screenToWorld(e.pageX, e.pageY);
        let oldElement = newSelectedElem;
        const newElements = elements.map((element) => {
          if (element === newSelectedElem) {
            newElement = {
              ...element,
              dimension: {
                ...element.dimension,
                startX:
                  isSelected.dimension.startX + (pos.x - initialSelectPnt.x),
                startY:
                  isSelected.dimension.startY + (pos.y - initialSelectPnt.y),
                endX: isSelected.dimension.endX + (pos.x - initialSelectPnt.x),
                endY: isSelected.dimension.endY + (pos.y - initialSelectPnt.y),
                points: isSelected.dimension.points.map((point) => {
                  return {
                    x: point.x + (pos.x - initialSelectPnt.x),
                    y: point.y + (pos.y - initialSelectPnt.y),
                  };
                }),
              },
            };
            setNewSelectedElem(newElement);
            return newElement;
          }
          return element;
        });
        sendWS("UPDATE_ELEMENT", { oldElement, newElement });
        setElements(newElements);
      }
      if (isDrawing) {
        reDraw();

        const endX = e.pageX;
        const endY = e.pageY;
        startWorld = screenToWorld(startX, startY);
        endWorld = screenToWorld(endX, endY);
        if (shape === "pencil") {
          points.push({
            x: endWorld.x + Math.random() * 2 - 1,
            y: endWorld.y + Math.random() * 2 - 1,
          });
        }
        draw(
          startWorld.x,
          startWorld.y,
          endWorld.x,
          endWorld.y,
          points,
          currentShape
        );
        const message = {
          shape: currentShape,
          dimension: {
            startX: startWorld.x,
            startY: startWorld.y,
            endX: endWorld.x,
            endY: endWorld.y,
            points: points,
          },
        };
        sendWS("TEMP_CHAT", message);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (shape === "selection" && isSelected && initialSelectPnt) {
        if (!newElement) {
          newElement = newSelectedElem;
        }
        const message = {
          deleteElement: isSelected,
          newElement,
        };
        sendWS("CHANGE_ELEMENT", message);
        setInitialSelectPnt(null);
      } else if (shape === "eraser" && isDrawing) {
        setElements(unErasedElements);
        sendWS("ERASE", erasedElements);
        isDrawing = false;
      } else if (isDrawing) {
        const endX = e.pageX;
        const endY = e.pageY;
        startWorld = screenToWorld(startX, startY);
        endWorld = screenToWorld(endX, endY);
        const width = endWorld.x - startWorld.x;
        const height = endWorld.y - startWorld.y;
        const absWidth = Math.abs(width);
        const absHeight = Math.abs(height);
        if (currentShape === "square" || currentShape === "circle") {
          const absSide = Math.max(absWidth, absHeight);
          endWorld.x = startWorld.x + Math.sign(width) * absSide;
          endWorld.y = startWorld.y + Math.sign(height) * absSide;
        } else if (currentShape === "pencil") {
          points.forEach((point) => {
            startWorld.x = Math.min(point.x, startWorld.x);
            startWorld.y = Math.min(point.y, startWorld.y);
            endWorld.x = Math.max(point.x, endWorld.x);
            endWorld.y = Math.max(point.y, endWorld.y);
          });
        }
        const message = {
          id: `${Date.now()}+${Math.random()}`,
          shape: currentShape,
          dimension: {
            startX: startWorld.x,
            startY: startWorld.y,
            endX: endWorld.x,
            endY: endWorld.y,
            points: points,
          },
        };
        setElements((prev) => [...prev, message]);
        sendWS("CHAT", message);
        isDrawing = false;
        if (shape === "ellipse" || shape === "rect" || shape === "line") {
          setShape("selection");
        }
      }
    };

    const handleShiftDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        if (shape === "ellipse") {
          currentShape = "circle";
        } else if (shape === "rect") {
          currentShape = "square";
        }
        if (!isDrawing) return;
        if (!startWorld || !endWorld) return;
        reDraw();
        draw(
          startWorld.x,
          startWorld.y,
          endWorld.x,
          endWorld.y,
          points,
          currentShape
        );
        const message = {
          shape: currentShape,
          dimension: {
            startX: startWorld.x,
            startY: startWorld.y,
            endX: endWorld.x,
            endY: endWorld.y,
            points: points,
          },
        };
        sendWS("TEMP_CHAT", message);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        const newElements = elements.filter((element) => {
          if (element != newSelectedElem) return true;
          return false;
        });
        setElements(newElements);
        setNewSelectedElem(null);
      }
    };

    const handleShiftUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        currentShape = shape;
        if (!isDrawing) return;
        if (!startWorld || !endWorld) return;
        reDraw();
        draw(
          startWorld.x,
          startWorld.y,
          endWorld.x,
          endWorld.y,
          points,
          currentShape
        );
        const message = {
          shape: currentShape,
          dimension: {
            startX: startWorld.x,
            startY: startWorld.y,
            endX: endWorld.x,
            endY: endWorld.y,
            points: points,
          },
        };
        sendWS("TEMP_CHAT", message);
      }
    };

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
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleShiftDown);
    window.addEventListener("keyup", handleShiftUp);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleShiftDown);
      window.removeEventListener("keyup", handleShiftUp);
    };
  }, [
    elements,
    canvasSize,
    zoom,
    pan,
    shape,
    isSelected,
    initialSelectPnt,
    newSelectedElem,
  ]);

  return (
    <>
      <div className="relative text-[#E0DFFF]">
        <div className={`fixed w-full h-full left-0 top-0`}>
          <canvas
            ref={canvasRef}
            height={canvasSize?.height || 0}
            width={canvasSize?.width || 0}
          />
        </div>
        <ToolKit
          shape={shape}
          setShape={setShape}
          setNewSelectedElem={setNewSelectedElem}
          canvas={canvasRef.current}
          zoom={zoom}
          setZoom={setZoom}
          setPan={setPan}
        />
      </div>
    </>
  );
}

export default Canvas;
