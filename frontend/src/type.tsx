export default interface  StyleState{
    roughness?: number;
    bowing?:number;
    stroke?:string;
    strokeWidth?:number;
    fill?:string;
    fillStyle?:'solid'|'zigzag'|"cross-hatch"|"dots"|"dashed"|'zigzag-line'|'fillWeight';
    hachureAngle?:number;
    hachureGap?:number;
    curveStepCount?:number;
    strokeLineDash?:number;
}
export type Area= {x1:number,y1:number,x2:number,y2:number,width:number,height:number}
export type Vector2d = {x:number,y:number};
export type rect = {x:number,y:number,width:number,height:number};