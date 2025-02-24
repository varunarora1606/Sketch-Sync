function ToolKit({
  setShape,
  setNewSelectedElem,
  canvas,
}: {
  setShape: any;
  setNewSelectedElem: any;
  canvas: HTMLCanvasElement | null;
}) {
  if(!canvas) return
  return (
    <div className="flex gap-2">
      <button
        className="text-white"
        onClick={() => {
          setNewSelectedElem(null);
          canvas.style.cursor = "crosshair";
          setShape("rect");
        }}
      >
        rect
      </button>
      <button
        className="text-white"
        onClick={() => {
          setNewSelectedElem(null);
          canvas.style.cursor = "crosshair";
          setShape("ellipse");
        }}
      >
        ellipse
      </button>
      <button
        className="text-white"
        onClick={() => {
          setNewSelectedElem(null);
          canvas.style.cursor = "crosshair";
          setShape("pencil");
        }}
      >
        pencil
      </button>
      <button
        className="text-white"
        onClick={() => {
          setShape("selection");
          canvas.style.cursor = "default";
        }}
      >
        selection
      </button>
    </div>
  );
}

export default ToolKit;
