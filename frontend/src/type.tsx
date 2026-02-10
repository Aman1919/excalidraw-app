export default interface  StyleState{
    roughness?: number;
    bowing?:number;
    stroke?:string;
    strokeWidth?:number;
    fill?:string;
    fillStyle?:'solid'|'zigzag'|"cross-hatch"|"dots"|"dashed"|'zigzag-line'|'fillWeight';
    hachureAngle?:number;
    hachureGap?:number;
    curveStepCount?:number;
    strokeLineDash?:number;
}
export type Area= {x1:number,y1:number,x2:number,y2:number,width:number,height:number}
export type Vector2d = {x:number,y:number};
export type rect = {x:number,y:number,width:number,height:number};


export type Actions =
  | "IDLE"
  | "DRAWING"
  | "SELECTING"
  | "SELECTED"
  | "MOVING"
  | "SCALING"
  | "ROTATING";

export type ElementType = 'line' | "rect" | "circle"

const elementTypes = ["line", "rect", "circle"] as const;

export function isElementType(tool: string): tool is ElementType {
  return elementTypes.includes(tool as ElementType);
}
export type ScaleType = 'left'|'right'|'top'|'bottom'|'tr'|"tl"|'br'|'bl'|null