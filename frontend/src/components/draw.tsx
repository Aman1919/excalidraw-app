/* eslint-disable @typescript-eslint/no-explicit-any */
import type StyleState from "../type"

export function DrawDiagrams(x1:number,y1:number,width:number,height:number,type:string,rctx:any,x2:number=0,y2:number=0,style:StyleState = {roughness: 0.5, stroke: 'white', strokeWidth: 2 },angle =0){

        const selectionState = {roughness: 0.5, stroke: '#a8a5ff',fill:"rgba(168, 165, 255,0.5)", strokeWidth: 1 }
function rect() {
    const s  = (type==='select')?selectionState:style
    rctx.rectangle(x1, y1, width, height, s);
}
function circle() {
            rctx.ellipse(x1, y1, width, height,style);

}

function line() {
            rctx.line(x1,y1,x2,y2,{ stroke: "white" },style)
}

function selectionBorder() {
    const color = "#a8a5ff"
    const strokeWidth = 0.7
    rctx.rectangle(x1, y1, x2-x1, y2-y1, {roughness: 0, stroke: color, strokeWidth });
    rctx.circle((x1+x2)/2, y1-10, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    rctx.circle(x1, y1, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    rctx.circle(x2, y1, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    rctx.circle(x1, y2, 8, { fill: 'black',stroke:color ,strokeWidth: 1,roughness: 0,fillStyle:"solid"})  
    rctx.circle(x2, y2, 8, { fill: 'black',stroke:color,strokeWidth: 1 ,roughness: 0,fillStyle:"solid"})  
}

switch (type) {
    case 'line':
          line();
        break;
    case 'circle':
            circle()
            break;
    case 'rectangle':
            rect()
            break;
    case 'selectionBorder':
            selectionBorder()
            break;
     case 'select':
            rect()
            break;       
        default:
        break;
}

}




export function ClearCanvas(ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#1d1d24";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
}
