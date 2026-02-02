import rough from "roughjs";
import Element  from "./element";
import {ClearCanvas} from "./drawgraphics"
// import CollisionCheck from "./collision"
import Selection from "./selection"



export default class DrawEngine {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    currentTool: string;
    shapes: Element[] =
        [];
    draftShape: Element | null = null;
    mode:'IDLE'|'SELECTING'|'DRAWING'|'MOVING'='IDLE';
    historyActions = []
    // selectMode:{x1:number,y1:number,x2:number,y2:number,width:number,height:number}|null = null
    // selectedElements:{el:Element[],x:number,y:number} = {el:[],x:0,y:0};
    selection:Selection;
    setCurrentTool:(tool:string)=>void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rctx: any;
    constructor(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        currentTool: string,
        setCurrentTool:(tool: string) => void
    ) {
        this.ctx = ctx;
        this.rctx = rough.canvas(canvas);
        this.canvas = canvas;
        this.currentTool = currentTool;
        this.selection = new Selection()
        this.setCurrentTool = setCurrentTool
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
        for(const shape of this.shapes){
            shape.draw()
        }
       this.selection.draw(this.rctx)
       if(this.draftShape)this.draftShape.draw()
       this.selection.selectedElements.forEach((obj) => obj.selected());
       this.selection.groupSelection(this.rctx)
      

    }

    updateCurrentTool(tool:string){
        this.currentTool = tool
        
    }
     

   
    mouseAction(action: string, e: React.MouseEvent<HTMLCanvasElement>) {
        console.log(action)
        const { x, y } = this.getCanvasCoord(e);
       const hoverOnElement =  this.selection.MouseOnElement(x,y,this.shapes,this.canvas)
        if (action === "mouseup") {
            this.mouseup()
        } else if (action === "mousedown") {
            this.mousedown(x,y,hoverOnElement)
        } else if (action == "mousemove") {
            this.mousemove(x,y)
        }else if(action=="click"){
          this.click(x,y)
        }
    }

    click(x:number,y:number){
         if(this.currentTool ==='select'){
            this.selection.MouseCollisionWithElements(x,y,this.shapes)
          }else{
            // c
          }
    }
    mousedown(x:number,y:number,hoverOnElement:boolean){
            if(this.currentTool==='select'){
                if(!hoverOnElement){
                    this.mode = 'SELECTING';
                    this.selection.start(x,y);
                }
                if(this.selection.hasSelected()){
                   this.mode = "MOVING"
                   this.selection.startMove(x,y)
                }
            }else{
                this.draftShape = new Element(x,y,x,y,this.currentTool,this.rctx,0,0)
                this.mode = 'DRAWING';
            }

    }

    mousemove(x:number,y:number){
            if(this.mode === 'SELECTING'){
                this.selection.updateCoordinates(x,y)
            }else if(this.mode === 'DRAWING') {
                this.updateDraftCoords(x,y)
            }else if(this.mode === 'MOVING'){
                 this.selection.MoveElement(x,y)
            } 
            if(this.mode !== 'IDLE'){   
                this.redraw()
                this.selection.ScanElements(this.shapes)
            }
    }

    mouseup(){
           if(this.mode==='SELECTING'){
                this.selection.stop(this.shapes)
                this.redraw()
            }else if(this.mode==='DRAWING'&&this.draftShape){
                this.shapes.push(this.draftShape);
                this.draftShape.draw()
                this.draftShape = null;
                this.setCurrentTool('select')
            }else if(this.mode==='MOVING'){
                this.selection.stopMove()
                this.redraw()
            }
            this.mode = 'IDLE'
    }



    updateDraftCoords(x:number,y:number){
        if(!this.draftShape)return;
        const {type}=this.draftShape
        if(type=='line'){
        this.draftShape.x2 = x
        this.draftShape.y2 = y
        }else if(type=="rectangle" || type == "circle"){
        this.draftShape.width = x-this.draftShape.x1;
        this.draftShape.height = y-this.draftShape.y1;
        this.draftShape.x2 = x;
        this.draftShape.y2 = y            
        }
    }
    
    getCanvasCoord(e: React.MouseEvent<HTMLCanvasElement>) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    }   
}



