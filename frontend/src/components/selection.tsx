/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Area } from "../type";
import { selectionCollision } from "./collisions";
import { DrawDiagrams } from "./draw";
import Element from "./element"

export default class Selection{
  selectedElements:Element[]= [];
selectionAreaCoords: Area = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
  };
  selectionBorder:Area | null = null
 isDragging = true;
    moveCoords = { x:0, y:0 };
mode:"IDLE" | "DRAWING" | "SELECTING" | "MOVING"="IDLE"
 
draw(rctx: any) {
    const { x1, y1, width, height } = this.selectionAreaCoords;
    DrawDiagrams(x1, y1, width, height, "select", rctx);
}

InitSelection(x:number,y:number){
    this.selectionAreaCoords = {x1:x,x2:x,y1:y,y2:y,width:0,height:0}
    this.mode = "SELECTING"
}

updateCoordinates(x: number, y: number) {
    this.selectionAreaCoords.width = x - this.selectionAreaCoords.x1;
    this.selectionAreaCoords.height = y - this.selectionAreaCoords.y1;
    this.selectionAreaCoords.x2 = x;
    this.selectionAreaCoords.y2 = y;
}

ScanElements(elements: Element[]) {
      this.selectedElements = [];
    for (const element of elements) {
      if(selectionCollision(element,this.selectionAreaCoords)){
        this.selectedElements.push(element);
      }
    }
  }

    groupSelection(rctx: any) {
    if (!this.selectedElements.length) return;
    
    const { min_x, min_y, max_x, max_y } = this.min_max_x_y();
    console.log(min_x, min_y, max_x, max_y);
    DrawDiagrams(
      min_x,
      min_y,
      max_x,
      max_y,
      "selectionBorder",
      rctx,
      max_x,
      max_y,
    );
  }

  min_max_x_y() {
    // 10 difference bcz space btw the element and the border
    const min_x = Math.min(
      ...this.selectedElements.map((el) => Math.min(el.x1, el.x2)),
    ) - 10 ;
    const max_x = Math.max(
      ...this.selectedElements.map((el) => Math.max(el.x1, el.x2)),
    ) + 10;
    const min_y = Math.min(
      ...this.selectedElements.map((el) => Math.min(el.y1, el.y2)),
    ) - 10;
    const max_y = Math.max(
      ...this.selectedElements.map((el) => Math.max(el.y1, el.y2)),
    ) + 10;
    return { min_x, min_y, max_x, max_y };
  }

  HoverOverSelectedElements(x:number,y:number){
    const { min_x, min_y, max_x, max_y } = this.min_max_x_y();
    return (x>=min_x && x<=max_x && y>=min_y && y<=max_y)
  }

}
