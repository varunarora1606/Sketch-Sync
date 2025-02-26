function ToolKit({
  setShape,
  setNewSelectedElem,
  zoom,
  setZoom,
  setPan,
  canvas,
}: {
  setShape: any;
  setNewSelectedElem: any;
  zoom: any;
  setZoom: any;
  setPan: any;
  canvas: HTMLCanvasElement | null;
}) {
  if (!canvas) return;
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
          setShape("line");
        }}
      >
        line
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
          setNewSelectedElem(null);
          canvas.style.cursor = "crosshair";
          setShape("eraser");
        }}
      >
        eraser
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
      <div>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ X: 0, Y: 0 });
          }}
        >
          {zoom > 30 ? 3000 : zoom < 0.1 ? 10 : Math.trunc(zoom * 100)}%
        </button>
      </div>
    </div>
  );
}

export default ToolKit;
