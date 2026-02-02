/* eslint-disable @typescript-eslint/no-explicit-any */
import {type Area} from "./../../type"
import Element from "./element"
import {DrawDiagrams} from "./drawgraphics"
import CollisionCheck from "./collision";
export default class Selection{
    selectedElements:Element[] = [];
    selectionAreaCoords :Area  = {x1:0,y1:0,x2:0,y2:0,width:0,height:0}
    moveCoords = {x:0,y:0};
    
    startMove(x:number,y:number){
if(CollisionCheck(x,y,'point_element_collision',this.selectedElements[0])){
  const {min_x,min_y}= this.min_max_x_y();
  this.moveCoords = {x:min_x,y:min_y};
}
   
    }
    MoveElement(x:number,y:number){
      this.selectedElements[0].x1 = x
      this.selectedElements[0].y1 = y
    }

    stopMove(){
      this.selectedElements = []
      this.moveCoords = {x:0,y:0}
    }

    draw(rctx:any){
       const {x1,y1,width,height}=this.selectionAreaCoords;
        DrawDiagrams(x1,y1,width,height,'select',rctx);
    }

    start(x:number,y:number){
     this.selectionAreaCoords = {x1:x,y1:y,x2:x,y2:y,width:x,height:y}
    }

    updateCoordinates(x:number,y:number){
        this.selectionAreaCoords.width = x-this.selectionAreaCoords.x1;
        this.selectionAreaCoords.height= y-this.selectionAreaCoords.y1;
        this.selectionAreaCoords.x2= x
        this.selectionAreaCoords.y2= y           
    }
    
    groupSelection(rctx:any){
    if(!this.selectedElements.length)return;
    if(this.selectedElements.length==1){
        this.selectedElements[0].selected();
    return;
    }
    const {min_x,min_y,max_x,max_y}= this.min_max_x_y();
     console.log(min_x,min_y,max_x,max_y)
     DrawDiagrams(min_x,min_y,max_x,max_y,'selectionBorder',rctx,max_x,max_y)
}

min_max_x_y(){
      const min_x = Math.min(...this.selectedElements.map((el)=>Math.min(el.x1,el.x2)))
    const max_x =  Math.max(...this.selectedElements.map((el)=>Math.max(el.x1,el.x2)))
    const min_y = Math.min(...this.selectedElements.map((el)=>Math.min(el.y1,el.y2)))
    const max_y =  Math.max(...this.selectedElements.map((el)=>Math.max(el.y1,el.y2)))
    return {min_x,min_y,max_x,max_y};
}
    ScanElements(shapes:Element[]){
      // Check how elements comes under the selection area 
        for(const shape of shapes){
            if(CollisionCheck(0,0,'selection_collision',shape,this.selectionAreaCoords)&&!this.selectedElements.some((obj) => obj.id === shape.id)){
                        this.selectedElements.push(shape);
                        shape.selected()
            }
        }  
    }


    MouseCollisionWithElements(x:number,y:number,shapes:Element[]){
            //if we click on a element then select it 
            shapes.forEach((shape) => {
                    if(CollisionCheck(x,y,'point_element_collision',shape)){
                        if (!this.selectedElements.some((obj) => obj.id === shape.id)) {
                            this.selectedElements.push(shape);
                            shape.selected()
                        }
                      console.log(shape,"collision")
                    }else{
    this.selectedElements = this.selectedElements.filter((obj) => obj.id !== shape.id);
                        shape.deselected()
                    }
                });
        }

            //if mouse hovers over element or group of elements
MouseOnElement(x:number,y:number,shapes:Element[],canvas:HTMLCanvasElement){
    const elements = this.selectedElements
const a = shapes.some((shape) => {
                if(CollisionCheck(x,y,'point_element_collision',shape)){
                  canvas.style.cursor = 'all-scroll'
                  return true
                }else{
                  canvas.style.cursor = 'default'
                    this.selectedElements = elements.filter((obj) => obj.id !== shape.id);
                    shape.deselected()
                    return false
                }
            }) 
                const min_x = Math.min(...elements.map((el)=>Math.min(el.x1,el.x2)))
                const max_x =  Math.max(...elements.map((el)=>Math.max(el.x1,el.x2)))
                const min_y = Math.min(...elements.map((el)=>Math.min(el.y1,el.y2)))
                const max_y =  Math.max(...elements.map((el)=>Math.max(el.y1,el.y2)))
                
                return (x>=min_x && x<=max_x && y>=min_y && y<=max_y) || a   
}

    stop(shapes:Element[]){
      this.ScanElements(shapes);
      this.selectionAreaCoords = {x1:0,y1:0,x2:0,y2:0,width:0,height:0}
    }

    hasSelected(){
      return this.selectedElements.length
    }
}