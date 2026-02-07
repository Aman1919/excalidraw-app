import rough from "roughjs";
import Element  from "./element";
import {ClearCanvas} from "./draw"
import {pointElementCollision} from "./collisions"
import Selection from "./selection"
import type { Vector2d } from "../type";



export default class DrawEngine {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    elements: Element[] =
        [];
    draftElement: Element | null = null;
    historyActions = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rctx: any;
    action = ''
    selection:Selection = new Selection()
    constructor(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        
    ) {
        this.ctx = ctx;
        this.rctx = rough.canvas(canvas);
        this.canvas = canvas;
        this.Init();
    }
    Init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.fillStyle = "#1d1d24";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    redraw() {
       ClearCanvas(this.ctx,this.canvas)
        for(const element of this.elements){
            element.draw()
        }
        this.draftElement?.draw()
        if(this.selection.mode === 'SELECTING'){
            this.selection.draw(this.rctx);
        }
        this.selection.groupSelection(this.rctx)
    }   

    setDraftElement(x:number,y:number,type:string){
        this.draftElement = new Element(x,y,x,y,type,this.rctx,0,0,this.ctx);
    }

    addDraftElement(){
       if(!this.draftElement)return;
        this.elements.push(this.draftElement)
        this.draftElement =null
    }
   
    addSelectedElements(element:Element){
        this.selection.selectedElements = []
   this.selection.selectedElements.push(element)
   return this.selection.selectedElements
    }

    elementSelected(){
      return  this.selection.selectedElements.length
    }

    HoverOverNonSelectedElement({x,y}:Vector2d){
    const  a = this.elements.find((element)=>{
        if(pointElementCollision(x,y,element)){
            return element;
        }
    })
    if(!a){
        this.canvas.style.cursor = 'default'
    }else{
        this.canvas.style.cursor = 'all-scroll' 
    }
    return a;
    }

   

   HoverOverSelectionBorder({x,y}:Vector2d){
  if (!this.selection.selectionBorder) return;

const EDGE = 6;
const { x1, x2, y1, y2 } = this.selection.selectionBorder;

// Horizontal edges
const widthEdges = [
  { name: "top", x1, y1: y1 - EDGE, x2, y2: y1 + EDGE },
  { name: "bottom", x1, y1: y2 - EDGE, x2, y2: y2 + EDGE },
];

// Vertical edges
const heightEdges = [
  { name: "left", x1: x1 - EDGE, y1, x2: x1 + EDGE, y2 },
  { name: "right", x1: x2 - EDGE, y1, x2: x2 + EDGE, y2 },
];

// Rotation
const middleCircle = { x: (x1 + x2) / 2, y: y1 - 12 };

// Corners
const cornerCircles = [
  { name: "tl", x: x1, y: y1 },
  { name: "tr", x: x2, y: y1 },
  { name: "bl", x: x1, y: y2 },
  { name: "br", x: x2, y: y2 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hit = (r: any) =>
  x > r.x1 && x < r.x2 && y > r.y1 && y < r.y2;

// Edges
for (const e of [...widthEdges, ...heightEdges]) {
  if (hit(e)) {
    this.canvas.style.cursor =
      e.name === "top" || e.name === "bottom"
        ? "row-resize"
        : "ew-resize";

    return { message: e.name, type: "selection_border" };
  }
}

// Rotation
if (Math.abs(x - middleCircle.x) < 6 && Math.abs(y - middleCircle.y) < 6) {
  this.canvas.style.cursor = "grab";
  return { message: "rotate", type: "selection_border" };
}

// Corners
for (const c of cornerCircles) {
  if (Math.abs(x - c.x) < 6 && Math.abs(y - c.y) < 6) {
    if(c.name ==='tl'||c.name ==='br'){
        this.canvas.style.cursor = "nwse-resize";
    }else {
        this.canvas.style.cursor = "nesw-resize";
    }
    return { message: c.name, type: "selection_border" };
  }
}
return null
   }

    startSelection({x,y}:Vector2d){
    this.selection.selectedElements = []
    this.selection.InitSelection(x,y)
    }

    updateSelection({x,y}:Vector2d){
        this.selection.updateCoordinates(x,y);
     return  this.selection.ScanElements(this.elements);
    }

    stopSelection() {
  const els = this.selection.ScanElements(this.elements);

        this.selection.selectionAreaCoords = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            width: 0,
            height: 0,
        };
        return els;
  }

  startMove({x,y}:Vector2d){
    if(!this.selection.HoverOverSelectedElements(x,y)||!this.selection.selectedElements.length)return;
    this.selection.isDragging = true
    this.selection.lastCoords = {x,y}
  } 
  updateMoving({x,y}:Vector2d){
    if(!this.selection.isDragging)return
    this.selection.selectedElements.forEach((element) => {
   const dx = x  - this.selection.lastCoords.x
   const dy = y  - this.selection.lastCoords.y
    element.x1 +=dx
    element.y1 +=dy
    element.x2 +=dx
    element.y2 +=dy
   });
   this.selection.lastCoords = {x,y}
  }

  stopMoving(){
    this.selection.lastCoords = {x:0,y:0};
    this.selection.isDragging = false

  }
   updateDraftCoordinates(x: number, y: number) {
    if(!this.draftElement)return;
    this.draftElement.updateDraftCoords({x,y});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Hover({x,y}:Vector2d):any{
if(['MOVING','SCALING',"ROTATING"].includes(this.selection.mode))return
    const nonSelectedElement = this.HoverOverNonSelectedElement({x,y})
    const selectedElements = this.selection.HoverOverSelectedElements(x,y)
    const selectionBorder = this.HoverOverSelectionBorder({x,y});
    if(selectedElements){
        this.canvas.style.cursor = 'move'
        return selectedElements
    }else if(nonSelectedElement){
        this.canvas.style.cursor = 'move'
    return nonSelectedElement;
    }else if(selectionBorder){
      return selectionBorder
    }else{
        this.canvas.style.cursor = 'default'
    }
    return null;
  }
  
  startTransform(type:"left"|'right'|'top'|'bottom'|"equal"|"rotate",x:number,y:number){
    if(!this.selection.selectedElements.length)return;
    if(type==='rotate'){
      this.selection.mode = 'ROTATING'
    }else if(['left','right','top','bottom'].includes(type)){
        this.selection.mode = "SCALING"
        this.selection.Scalingtype = type
        console.log(this.selection.Scalingtype)
    }else{
        this.selection.mode = "SCALING"
        this.selection.Scalingtype = "equal"
        console.log(this.selection.Scalingtype)
    }
    this.selection.lastCoords = {x,y}
  }

  transforming(x:number,y:number){
    //in mouse move
    const transformMode = this.istransforming()
    if(!this.selection.selectedElements.length||!transformMode)return;
    if(transformMode==='ROTATING'){
//
this.selection.selectedElements.forEach((element) => {
    const cx = (element.x1 + element.x2) / 2;
const cy = (element.y1 + element.y2) / 2;

const angle = Math.atan2(y - cy, x - cx);

element.rotate(angle);
});
    }else if(transformMode==='SCALING'){
        console.log('scale')
   this.selection.selectedElements.forEach((element) => {
    const dx = x - this.selection.lastCoords.x
    const dy = y - this.selection.lastCoords.y
    element.scale(dx,dy,this.selection.Scalingtype)
   });  
    }
  }

  istransforming(){
    if(this.selection.mode==='SCALING'|| this.selection.mode==='ROTATING')return this.selection.mode
    else return null
  }
    stopTransforming(){
        this.selection.mode = 'IDLE'
    this.selection.lastCoords = {x:0,y:0};
    }


    getCanvasCoord(e: React.MouseEvent<HTMLCanvasElement>) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }   
}



