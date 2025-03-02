import { Element, Shape } from "@/types";
import {
  ArrowLeft,
  Circle,
  Eraser,
  Minus,
  MousePointer,
  Pencil,
  Square,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

function ToolKit({
  shape,
  setShape,
  setNewSelectedElem,
  zoom,
  setZoom,
  setPan,
  canvas,
}: {
  shape: Shape;
  setShape: Dispatch<SetStateAction<Shape>>;
  setNewSelectedElem: Dispatch<SetStateAction<Element | null>>;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
  setPan: Dispatch<
    SetStateAction<{
      X: number;
      Y: number;
    }>
  >;
  canvas: HTMLCanvasElement | null;
}) {
  if (!canvas) return;
  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-1 bg-[#232329] text-xs rounded-lg p-1">
        <button
          className={` p-2.5 rounded-lg ${shape === "selection" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            canvas.style.cursor = "default";
            setShape("selection");
          }}
        >
          <MousePointer
            size={13}
            fill={`${shape === "selection" ? "currentColor" : "none"}`}
          />
        </button>
        <button
          className={` p-2.5 rounded-lg ${shape === "rect" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            setNewSelectedElem(null);
            canvas.style.cursor = "crosshair";
            setShape("rect");
          }}
        >
          <Square
            size={13}
            fill={`${shape === "rect" ? "currentColor" : "none"}`}
          />
        </button>
        <button
          className={` p-2.5 rounded-lg ${shape === "ellipse" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            setNewSelectedElem(null);
            canvas.style.cursor = "crosshair";
            setShape("ellipse");
          }}
        >
          <Circle
            size={13}
            fill={`${shape === "ellipse" ? "currentColor" : "none"}`}
          />
        </button>
        <button
          className={`p-2.5 rounded-lg ${shape === "line" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            setNewSelectedElem(null);
            canvas.style.cursor = "crosshair";
            setShape("line");
          }}
        >
          <Minus
            size={13}
            fill={`${shape === "line" ? "currentColor" : "none"}`}
          />
        </button>
        <button
          className={` p-2.5 rounded-lg ${shape === "pencil" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            setNewSelectedElem(null);
            canvas.style.cursor = "crosshair";
            setShape("pencil");
          }}
        >
          <Pencil size={13} />
        </button>
        <button
          className={` p-2.5 rounded-lg ${shape === "eraser" ? "bg-[#403E6A]" : "hover:bg-[#31303B]"}`}
          onClick={() => {
            setNewSelectedElem(null);
            canvas.style.cursor = "crosshair";
            setShape("eraser");
          }}
        >
          <Eraser size={13} />
        </button>
        <button
          className="hover:bg-[#31303B] py-2.5 rounded-lg px-3.5"
          onClick={() => {
            setZoom(1);
            setPan({ X: 0, Y: 0 });
          }}
        >
          {zoom > 30 ? 3000 : zoom < 0.1 ? 10 : Math.trunc(zoom * 100)}%
        </button>
      </div>
      <div className="fixed top-4 left-4 flex gap-1 bg-[#232329] text-xs rounded-lg overflow-hidden items-center justify-center">
        <button className={`p-2.5 hover:bg-[#31303B]`} onClick={() => {redirect("/dashboard")}}>
          <ArrowLeft size={20} />
        </button>
      </div>
    </>
  );
}

export default ToolKit;
