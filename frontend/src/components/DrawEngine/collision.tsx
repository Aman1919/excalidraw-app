import Element from "./element"

export default function CollisionCheck(x:number,y:number,type:string,shape:Element,selectCoords?:{x1:number,y1:number,x2:number,y2:number,width:number,height:number}|null){
/**
 * (x,y) collision with element
 * (x,y) collision with groups of elements
 * selection rect collision with elements 
 * 
 */
function pointElementCollision(x:number,y:number){
    const min_x = Math.min(shape.x1,shape.x2)
    const min_y = Math.min(shape.y1,shape.y2)
    const max_x = Math.max(shape.x1,shape.x2)
    const max_y = Math.max(shape.y1,shape.y2)
    return (x>=min_x && x<=max_x && y>=min_y && y<=max_y)
}

function selectionCollision(shape:Element){
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

switch(type){
    case 'point_element_collision':
     return  pointElementCollision(x,y)
        break
    case 'selection_collision':
     return  selectionCollision(shape)
        break
        
    default:
        break;

}
}