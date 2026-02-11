import {type Actions, type ScaleType} from "../type"
import {pointElementCollision,min_max_x_y} from "./collision"
import Element from "./element"


export function  Hover(x:number,y:number,action:Actions,canvas:HTMLCanvasElement,elements:Element[],selectedElements:Element[]){
if(['MOVING','SCALING',"ROTATING","SELECTING"].includes(action))return
    const nonSelectedElement = HoverOverAllElements(x,y,elements,canvas)
    const SelectedElements = HoverOverSelectedElements(x,y,selectedElements)
    const selectionBorder = (selectedElements.length>0)?HoverOverSelectionBorder(x,y,elements,canvas):false;
    if(SelectedElements){
        canvas.style.cursor = 'move'
        return SelectedElements
    }else if(nonSelectedElement){
        canvas.style.cursor = 'move'
    return nonSelectedElement;
    }else if(selectionBorder){
      return selectionBorder
    }else{
        canvas.style.cursor = 'default'
    }
    return null;
  }


export function HoverOverAllElements(x:number,y:number,elements:Element[],canvas:HTMLCanvasElement) {
        const  a = elements.find((element)=>{
            if(pointElementCollision(x,y,element)){
                return element;
            }
        })
        if(!a){
            canvas.style.cursor = 'default'
        }else{
            canvas.style.cursor = 'all-scroll' 
        }
        return a;
    
}


 export function  HoverOverSelectionBorder(x:number,y:number,selectedElements:Element[],canvas:HTMLCanvasElement):{message:ScaleType | 'rotate',type:string}| null{
      const { min_x, min_y, max_x, max_y } = min_max_x_y(selectedElements);
  
    const selectionBorder = {
      x1:min_x,
      x2:max_x,
      y1:min_y,
      y2:max_y,
      width:max_x -min_x,
      height:max_y - min_y
    }

const EDGE = 6;
const { x1, x2, y1, y2 } = selectionBorder;

const widthEdges: { name: ScaleType; x1: number; y1: number; x2: number; y2: number }[] = [
  { name: "top", x1, y1: y1 - EDGE, x2, y2: y1 + EDGE },
  { name: "bottom", x1, y1: y2 - EDGE, x2, y2: y2 + EDGE },
];

const heightEdges: { name: ScaleType; x1: number; y1: number; x2: number; y2: number }[] = [
  { name: "left", x1: x1 - EDGE, y1, x2: x1 + EDGE, y2 },
  { name: "right", x1: x2 - EDGE, y1, x2: x2 + EDGE, y2 },
];

const cornerCircles: { name: ScaleType; x: number; y: number }[] = [
  { name: "tl", x: x1, y: y1 },
  { name: "tr", x: x2, y: y1 },
  { name: "bl", x: x1, y: y2 },
  { name: "br", x: x2, y: y2 },
];
const middleCircle = { x: (x1 + x2) / 2, y: y1 - 12 };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hit = (r: any) =>
  x > r.x1 && x < r.x2 && y > r.y1 && y < r.y2;

// Edges
for (const e of [...widthEdges, ...heightEdges]) {
  if (hit(e)) {
    canvas.style.cursor =
      e.name === "top" || e.name === "bottom"
        ? "row-resize"
        : "ew-resize";

    return { message: e.name, type: "selection_border" };
  }
}

// Rotation
if (Math.abs(x - middleCircle.x) < 6 && Math.abs(y - middleCircle.y) < 6) {
  canvas.style.cursor = "grab";
  return { message: "rotate", type: "selection_border" };
}

// Corners
for (const c of cornerCircles) {
  if (Math.abs(x - c.x) < 6 && Math.abs(y - c.y) < 6) {
    if(c.name ==='tl'||c.name ==='br'){
        canvas.style.cursor = "nwse-resize";
    }else {
        canvas.style.cursor = "nesw-resize";
    }
    return { message: c.name, type: "selection_border" };
  }
}
return null
   }

export function  HoverOverSelectedElements(x:number,y:number,selectedElements:Element[]){
    const { min_x, min_y, max_x, max_y } = min_max_x_y(selectedElements);
    return (x>=min_x && x<=max_x && y>=min_y && y<=max_y)
  }


