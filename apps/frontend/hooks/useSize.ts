import { useEffect, useState } from "react";

export default function useSize() {
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  }>();
  useEffect(() => {
    if (!canvasSize) {
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

  return canvasSize;
}
