export interface Element {
  id: string;
  shape: CurrentShape;
  dimension: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    points: { x: number; y: number }[];
  };
}
export type Shape = "rect" | "ellipse" | "pencil" | "line" | "selection" | "eraser";
