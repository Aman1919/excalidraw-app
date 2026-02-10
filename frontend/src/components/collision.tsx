import Element from "./element"
import {type Area} from "../type"

export function pointElementCollision(x:number,y:number,shape:Element){
    const min_x = Math.min(shape.x1,shape.x2)
    const min_y = Math.min(shape.y1,shape.y2)
    const max_x = Math.max(shape.x1,shape.x2)
    const max_y = Math.max(shape.y1,shape.y2)
    return (x>=min_x && x<=max_x && y>=min_y && y<=max_y)
}

export function selectionCollision(shape:Element,selectCoords:Area){
    if(!selectCoords)return false;
    const {x1,x2,y1,y2}=selectCoords;;
    const smin_x = Math.min(x1,x2)
    const smin_y = Math.min(y1,y2)
    const smax_x = Math.max(x1,x2)
    const smax_y = Math.max(y1,y2)

    const min_x = Math.min(shape.x1,shape.x2)
    const min_y = Math.min(shape.y1,shape.y2)
    const max_x = Math.max(shape.x1,shape.x2)
    const max_y = Math.max(shape.y1,shape.y2)

   return (smin_x<=min_x && smin_x<=max_x && smax_x>=min_x && smax_x>=max_x && smin_y<=min_y && smin_y<=max_y && smax_y>=min_y && smax_y>=max_y)
}


export function min_max_x_y(selectedElements:Element[]) {
    // 10 difference bcz space btw the element and the border
    const min_x = Math.min(
      ...selectedElements.map((el) => Math.min(el.x1, el.x2)),
    ) - 10 ;
    const max_x = Math.max(
      ...selectedElements.map((el) => Math.max(el.x1, el.x2)),
    ) + 10;
    const min_y = Math.min(
      ...selectedElements.map((el) => Math.min(el.y1, el.y2)),
    ) - 10;
    const max_y = Math.max(
      ...selectedElements.map((el) => Math.max(el.y1, el.y2)),
    ) + 10;
    return { min_x, min_y, max_x, max_y };
  }

