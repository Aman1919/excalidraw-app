
export type BaseStyle = {
  stroke?: string;
  strokeWidth?: number;
  strokeStyle?: "solid" | "dashed" | "dotted";
  fillStyle?:"solid"|"zigzag"|"hachure"
  fill?: string | null;
  opacity?: number;
};

export type TextStyle = {
  fontSize?: number;
  fontFamily?: string;
  textAlign?: CanvasTextAlign;
};

export type Style = BaseStyle & TextStyle;

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
  | "ROTATING"
  | "WRITING"

export type ElementType = 'line' | "rect" | "circle" | "text"

const elementTypes = ["line", "rect", "circle",'text'] as const;

export function isElementType(tool: string): tool is ElementType {
  return elementTypes.includes(tool as ElementType);
}
export type ScaleType = 'left'|'right'|'top'|'bottom'|'tr'|"tl"|'br'|'bl'|null


