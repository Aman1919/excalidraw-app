/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vector2d } from "../type";
import {DrawDiagrams} from "./draw"
import type StyleState from "../type"

export default class Element {
    x1:number;y1:number;type:string;x2:number;y2:number;
    selectMode = false;id:string;rctx:any;
    width:number;height:number;
    style:StyleState = {
  roughness: 1.5,
  bowing: 1,

  stroke: "#ffffff",
  strokeWidth: 2,

  fill: "transparent",
  fillStyle: "solid",

  hachureAngle: 60,
  hachureGap: 8,

  curveStepCount: 9,

  strokeLineDash: 0,
};
angle = 0;
ctx:CanvasRenderingContext2D;
constructor(x1:number,y1:number,x2:number,y2:number,type:string,rctx:any,width:number,height:number,ctx:CanvasRenderingContext2D){
this.x1 = x1;
this.y1 = y1;
this.type = type;
this.x2=x2;
this.y2=y2
this.height = height;
this.width = width;
this.id = window.crypto.randomUUID()
this.rctx = rctx
this.ctx = ctx
}
draw() {
  const cx = (this.x1 + this.x2) / 2;
  const cy = (this.y1 + this.y2) / 2;

  this.drawType(cx, cy);
}

drawType(cx:number,cy:number){
    if(this.type==='rectangle'){
this.rctx.rectangle(this.x1,this.y1,this.width,this.height,this.style)
    }else if(this.type === 'line'){
const a = rotatePoint(this.x1, this.y1, cx, cy, this.angle);
  const b = rotatePoint(this.x2, this.y2, cx, cy, this.angle);

  this.rctx.line(a.x, a.y, b.x, b.y, this.style);
    }else if(this.type === 'circle'){
  const c = rotatePoint(this.x1, this.y1, cx, cy, this.angle);
  this.rctx.ellipse(c.x, c.y, this.width, this.height, this.style);
    }

}



selected(){
    this.selectMode = true
    const x1=this.x1-10;
    const y1=this.y1-10;
    const x2=this.width+20;
    const y2=this.height+20;

    const color = "#a8a5ff"
    const strokeWidth = 0.7
    this.rctx.rectangle(x1, y1, x2, y2, {roughness: 0, stroke: color, strokeWidth });
    this.rctx.circle(x1, y1, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    this.rctx.circle(x2+x1, y1, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    this.rctx.circle(x1, y2+y1, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    this.rctx.circle(x2+x1, y2+y1, 8, { fill: 'black',stroke:color,strokeWidth: 1 ,roughness: 0,fillStyle:"solid"})  
}
deselected(){
    this.selectMode = false;
    this.draw();
}

updateStyle(){
    
}

scale(dx: number, dy: number, handle: string) {
  switch (handle) {
    case "right":
      this.x2 += dx;
      break;

    case "left":
      this.x1 += dx;
      break;

    case "bottom":
      this.y2 += dy;
      break;

    case "top":
      this.y1 += dy;
      break;
    case "equal": {
      const cx = (this.x1 + this.x2) / 2;
      const cy = (this.y1 + this.y2) / 2;

      this.x1 -= dx;
      this.x2 += dx;
      this.y1 -= dy;
      this.y2 += dy;

      // re-center
      const ncx = (this.x1 + this.x2) / 2;
      const ncy = (this.y1 + this.y2) / 2;

      const offx = cx - ncx;
      const offy = cy - ncy;

      this.x1 += offx;
      this.x2 += offx;
      this.y1 += offy;
      this.y2 += offy;
      break;
    }
  }

  // update dimensions
  this.width = this.x2 - this.x1;
  this.height = this.y2 - this.y1;
}


rotate(angle:number){
this.angle = angle;
}

updateDraftCoords({x,y}:Vector2d){
this.width = x - this.x1;
this.height = y - this.y1;
this.x2 = x;
this.y2 = y;
}





}


function rotatePoint(
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number
) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: cos * (x - cx) - sin * (y - cy) + cx,
    y: sin * (x - cx) + cos * (y - cy) + cy,
  };
}