import { useRef, useEffect, useState, type MouseEvent } from "react";
import DrawEngine from "./engine";
type CanvasProps = {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
};

export default function Canvas({ currentTool, setCurrentTool }: CanvasProps) {
  const CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [draw, setDraw] = useState<DrawEngine | null>(null);
  const [mode, setMode] = useState<
    "IDLE" | "DRAWING" | "SELECTING" | "SELECTED" | "MOVING" | "SCALING"| "ROTATING"
  >("IDLE");
  const Elements = ["rectangle", "line", "circle"];
  // const [selectedElements,setSelectedElement]=useState<Element | null>(null);
  useEffect(() => {
    if (!CanvasRef || draw) return;
    const canvas = CanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setDraw(new DrawEngine(ctx, canvas));
  }, [CanvasRef]);

  function MouseDown(e: MouseEvent<HTMLCanvasElement>) {
    if (!draw) return;

    const { x, y } = draw.getCanvasCoord(e);
    const el = draw.Hover({x,y});

    if (Elements.includes(currentTool)) {
      setMode("DRAWING");
      draw.setDraftElement(x, y, currentTool);
      return;
    }

    if (currentTool === "select") {
      if (mode == "SELECTED") {
        setMode("MOVING");
        draw.startMove({ x, y });
      } else if (!el) {
        setMode("SELECTING");
        draw.startSelection({x,y});
      }else if(el&&el.type === 'selection_border'){
        draw.startTransform(el.message,x,y)
        const a = draw.istransforming();
        if(a)setMode(a)
      }

      draw.redraw();
    }
  }

  function MouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!draw) return;
    const { x, y } = draw.getCanvasCoord(e);
    draw.Hover({x,y});
    if (Elements.includes(currentTool) && mode === "DRAWING") {
      draw.updateDraftCoordinates(x, y);
      draw.redraw();
    } else if (currentTool === "select") {
      if (mode == "SELECTING") {
        draw.updateSelection({x,y});
        draw.redraw();
      } else if (mode === "MOVING") {
        draw.updateMoving({ x, y });
        draw.redraw();
      }else if(mode === 'ROTATING'||mode==='SCALING'){
      draw.transforming(x,y)
      draw.redraw();
      }
    }
  }

  function MouseUp(e: MouseEvent<HTMLCanvasElement>) {
    if (!draw) return;
    const { x, y } = draw.getCanvasCoord(e);
    const el = draw.HoverOverNonSelectedElement({x,y});

    if (Elements.includes(currentTool) && mode === "DRAWING") {
      draw.addDraftElement();
      draw.redraw();
      setMode("IDLE");
      setCurrentTool("select");
    } else if (currentTool === "select") {
      if (mode == "SELECTING") {
        draw.stopSelection();
        if (draw.elementSelected()) setMode("SELECTED");
        else setMode("IDLE");
        draw.redraw();
      } else if (mode === "MOVING") {
        draw.stopMoving();
        setMode("IDLE");
        draw.redraw();
      }else if(mode ==='ROTATING'){
       draw.stopTransforming()
       setMode("SELECTED")
      } else if (el) {
        draw.addSelectedElements(el);
        setMode("SELECTED");
      }
    }
  }

  return (
    <canvas
      ref={CanvasRef}
      onMouseDown={MouseDown}
      onMouseMove={MouseMove}
      onMouseUp={MouseUp}
    ></canvas>
  );
}
