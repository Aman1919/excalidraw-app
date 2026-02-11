/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ElementType, ScaleType,Style } from "../type";
import { drawElement } from "./draw";

export default class Element {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: ElementType;
  id: string;
  rctx: any;
  ctx:CanvasRenderingContext2D;
  width: number;
  height: number;
  text:string = "";
  style :Style;
  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: ElementType,
    rctx: any,
    ctx:CanvasRenderingContext2D
  ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.type = type;
    this.rctx = rctx;

    this.width = x2 - x1;
    this.height = y2 - y1;
    this.ctx = ctx

    this.id = crypto.randomUUID();
    this.style = {
  stroke: "#000000",
  strokeWidth: 2,
  strokeStyle: "solid",
  fill: null, 
  opacity: 1,
  fontSize: 30,
  fontFamily: "Inter, sans-serif",
  textAlign: "left",
};
  }

  setText(t:string){
    if(this.type!=='text')return;
    this.text= t;
  }
  
  draw() {
    drawElement(this, this.rctx,this.ctx);
  }

  move(x1: number, y1: number, lastCoords: { x: number; y: number }) {
    const dx = x1 - lastCoords.x;
    const dy = y1 - lastCoords.y;
    this.x1 += dx;
    this.y1 += dy;
    this.x2 += dx;
    this.y2 += dy;
  }

  scale(
    x: number,
    y: number,
    lastCoords: { x: number; y: number },
    type: ScaleType,
  ) {
    const dx = x - lastCoords.x;
    const dy = y - lastCoords.y;
    switch (type) {
      case "left":
        this.x1 += dx;
        this.width = this.x2 - this.x1;
        break;
      case "right":
        this.x2 += dx;
        this.width = this.x2 - this.x1;
        break;
      case "top":
        this.y1 += dy;
        this.height = this.y2 - this.y1;
        break;
      case "bottom":
        this.y2 += dy;
        this.height = this.y2 - this.y1;
        break;
      case "tr":
        this.x2 += dx;
        this.width = this.x2 - this.x1;
        this.y1 += dy;
        this.height = this.y2 - this.y1;
        break;
      case "tl":
        this.x1 += dx;
        this.width = this.x2 - this.x1;
        this.y1 += dy;
        this.height = this.y2 - this.y1;
        break;
      case "br":
        this.x2 += dx;
        this.width = this.x2 - this.x1;
        this.y2 += dy;
        this.height = this.y2 - this.y1;
        break;
      case "bl":
        this.x1 += dx;
        this.width = this.x2 - this.x1;
        this.y2 += dy;
        this.height = this.y2 - this.y1;
        break;

      default:
        break;
    }
  }

  rotate(x: number, y: number, lastCoords: { x: number; y: number }) {
    console.log(x, y, lastCoords);
// const centerX = x - Math.abs((this.x1+this.x2)/2)
// const centerY = y- Math.abs((this.y1+this.y2)/2)
//   const angle = Math.atan2(y - centerY,centerY);
//   this.ctx.translate(centerX, centerY);
//   this.ctx.rotate(angle);
//    this.ctx.restore();

  }

  updateDraftCoords(x: number, y: number) {
    this.x2 = x;
    this.y2 = y;
    this.width = x - this.x1;
    this.height = y - this.y1;
  }
}
