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
};;
constructor(x1:number,y1:number,x2:number,y2:number,type:string,rctx:any,width:number,height:number){
this.x1 = x1;
this.y1 = y1;
this.type = type;
this.x2=x2;
this.y2=y2
this.height = height;
this.width = width;
this.id = window.crypto.randomUUID()
this.rctx = rctx
// this.draw()  
}
draw(){
DrawDiagrams(this.x1,this.y1,this.width,this.height,this.type,this.rctx,this.x2,this.y2,this.style)
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

updateDraftCoords({x,y}:Vector2d){
this.width = x - this.x1;
this.height = y - this.y1;
this.x2 = x;
this.y2 = y;
}




}

