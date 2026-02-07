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
        this.draftElement = new Element(x,y,x,y,type,this.rctx,0,0);
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

    mouseDownOnElement(x:number,y:number){
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

   HoverOverElement(x:number,y:number){
    const a = this.selection.HoverOverSelectedElements(x,y) || this.mouseDownOnElement(x,y);
    if(!a){
        this.canvas.style.cursor = 'default'
    }else{
        this.canvas.style.cursor = 'all-scroll' 
    }
    return a;
   }

    startSelection(x:number,y:number){
    this.selection.selectedElements = []
    this.selection.InitSelection(x,y)
    }

    updateSelection(x:number,y:number){
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
    this.selection.moveCoords = {x,y}
  } 
  updateMoving({x,y}:Vector2d){
    if(!this.selection.isDragging)return
    this.selection.selectedElements.forEach((element) => {
   const dx = x  - this.selection.moveCoords.x
   const dy = y  - this.selection.moveCoords.y
    element.x1 +=dx
    element.y1 +=dy
    element.x2 +=dx
    element.y2 +=dy
   });
   this.selection.moveCoords = {x,y}
  }

  stopMoving(){
    this.selection.moveCoords = {x:0,y:0};
    this.selection.isDragging = false

  }
   updateDraftCoordinates(x: number, y: number) {
    if(!this.draftElement)return;
    this.draftElement.updateDraftCoords({x,y});
  }

  Hover(x:number,y:number){
    
  }
    
    getCanvasCoord(e: React.MouseEvent<HTMLCanvasElement>) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }   
}



