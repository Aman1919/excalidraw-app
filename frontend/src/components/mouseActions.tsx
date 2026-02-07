import DrawEngine from "./engine"



export default class MouseAction{
    draw:DrawEngine;
    setCurrentTool:()=>void;
    mode:string;
    currentTool:string;
   Elements = ["rectangle", "line", "circle"];
    
    constructor(draw:DrawEngine,currentTool:string,setCurrentTool:()=>void,mode:string){
        this.draw = draw
        this.mode = mode;
        this.currentTool = currentTool;
        this.setCurrentTool = setCurrentTool
    }
    MouseMove(e: React.MouseEvent<HTMLCanvasElement>,draw:DrawEngine) {
    if (!draw) return;
    const { x, y } = draw.getCanvasCoord(e);
    if (this.Elements.includes(this.currentTool) && this.mode === "DRAWING") {
      draw.updateDraftCoordinates(x, y);
      draw.redraw();
    } else if (this.currentTool === "select") {
      if (this.mode == "SELECTING") {
        draw.updateSelection(x, y);
        draw.redraw();
      } else if (this.mode === "MOVING") {
        draw.updateMoving({ x, y });
        draw.redraw();
      }
    }
  }
}



//   function MouseUp(e: MouseEvent<HTMLCanvasElement>) {
//     if (!draw) return;
//     const { x, y } = draw.getCanvasCoord(e);
//     const el = draw.mouseDownOnElement(x, y);

//     if (Elements.includes(currentTool) && mode === "DRAWING") {
//       draw.addDraftElement();
//       draw.redraw();
//       setMode("IDLE");
//       setCurrentTool("select");
//     } else if (currentTool === "select") {
//       if (mode == "SELECTING") {
//         draw.stopSelection();
//         if (draw.elementSelected()) setMode("SELECTED");
//         else setMode("IDLE");
//         draw.redraw();
//       } else if (mode === "MOVING") {
//         draw.stopMoving();
//         setMode("IDLE");
//         draw.redraw();
//       } else if (el) {
//         draw.addSelectedElements(el);
//         setMode("SELECTED");
//       }
//     }
//   }
