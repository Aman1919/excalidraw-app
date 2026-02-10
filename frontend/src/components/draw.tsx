/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Area } from "../type";
import { min_max_x_y } from "./collision";
import Element from "./element";

export function drawElement(element:Element,rctx:any){
        const {x1,y1,width,height,x2,y2,type,style}= element
switch (type) {
      case 'line':
         rctx.line(x1,y1,x2,y2,style)    
        break;
    case 'rect':
         rctx.rectangle(x1, y1, width, height, style);
        break;
    case  'circle':
         rctx.ellipse(x1, y1, width, height, style)    
        break;
      default:
        break;
    }    
}



export function selectionRect(area:Area,rctx:any){
   const {x1,y1,width,height}= area
    rctx.rectangle(x1, y1, width, height,{roughness: 0.5, stroke: '#a8a5ff',fill:"rgba(168, 165, 255,0.5)", strokeWidth: 1 });
}

export function selectionBorder(x1:number,x2:number,y1:number,y2:number,rctx:any) {
    const color = "#a8a5ff"
    const strokeWidth = 0.7
    rctx.rectangle(x1, y1, x2-x1, y2-y1, {roughness: 0, stroke: color, strokeWidth });
    rctx.circle((x1+x2)/2, y1-10, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    rctx.circle(x1, y1, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    rctx.circle(x2, y1, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    rctx.circle(x1, y2, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    rctx.circle(x2, y2, 8, { fill: 'black',stroke:color,strokeWidth: 1 ,roughness: 0,fillStyle:"solid"})  
}

export function groupSelection(rctx: any,selectedElements:Element[]) {
    if (!selectedElements.length) return;
    
    const { min_x, min_y, max_x, max_y } = min_max_x_y(selectedElements);
    console.log(min_x, min_y, max_x, max_y);
    
    selectionBorder(min_x,max_x,min_y,max_y,rctx)
  }

