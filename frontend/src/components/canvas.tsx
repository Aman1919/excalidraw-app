import {
  useRef,
  useState,
  useEffect,
  type MouseEvent,
  useLayoutEffect,
} from "react";
import { type Actions, isElementType ,type ScaleType} from "../type";
import Element from "./element";
import rough from "roughjs";
import { Hover, HoverOverSelectedElements, HoverOverSelectionBorder } from "./hover";
import { selectionCollision } from "./collision";
import { groupSelection } from "./draw";
type CanvasProps = {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  selectedElements: Element[];
  setSelectedElements: (el: Element[]) => void;
  elements: Element[];
  setElements: (el: Element[]) => void;
};

export default function Canvas({
  currentTool,
  setCurrentTool,
  selectedElements,
  elements,
  setElements,
  setSelectedElements,
}: CanvasProps) {
  const CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [action, setAction] = useState<Actions>("IDLE");
  const [scaleType,setScaleType] = useState<ScaleType>(null)
  const [draftElement, setDraftElement] = useState<Element | null>(null);
  const [selectionArea, setSelectionArea] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
  });
  const [lastCoords, setLastCoords] = useState({ x: 0, y: 0 });

  function drawCanvas(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "#1d1d24";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  useLayoutEffect(() => {
    if (!CanvasRef.current) return;
    const canvas = CanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;
    drawCanvas(canvas, ctx);
  }, [CanvasRef]);

  function redraw() {
    const canvas = CanvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1d1d24";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const rctx = rough.canvas(canvas);
    elements.forEach((el) => el.draw());
    draftElement?.draw();
    if (currentTool === "select" && action === "SELECTING") {
      const selectionState = {
        roughness: 0.5,
        stroke: "#a8a5ff",
        fill: "rgba(168, 165, 255,0.5)",
        strokeWidth: 1,
      };
      rctx.rectangle(
        selectionArea.x1,
        selectionArea.y1,
        selectionArea.width,
        selectionArea.height,
        selectionState,
      );
    }

    groupSelection(rctx, selectedElements);
  }

  function MouseDown(e: MouseEvent<HTMLCanvasElement>) {
    if (!CanvasRef.current||!ctxRef.current) return;

    const { x, y } = getCanvasCoord(e);
    const el = Hover(
      x,
      y,
      action,
      CanvasRef.current,
      elements,
      selectedElements,
    );
    const hoverSelectionBorder = HoverOverSelectionBorder(x,y,selectedElements,CanvasRef.current)
    if (isElementType(currentTool) && CanvasRef.current) {
      setDraftElement(
        new Element(x, y, x, y, currentTool, rough.canvas(CanvasRef.current),ctxRef.current),
      );
      setAction("DRAWING");
      return;
    }
    if (currentTool === "select") {
      console.log(el);
      if (action == "SELECTED") {
        if (HoverOverSelectedElements(x, y, selectedElements)) {
          setAction("MOVING");
        }else if(hoverSelectionBorder){
          if(hoverSelectionBorder.message!=='rotate'){
            setAction('SCALING')
            setScaleType(hoverSelectionBorder.message)
          }else{
            setAction('ROTATING')
            setScaleType(hoverSelectionBorder.message)
          }
        }
      } else if (!el && action) {
        setAction("SELECTING");
        setSelectionArea({ x1: x, y1: y, x2: x, y2: y, width: 0, height: 0 });
      } else if (el) {
        //
      }
    }
    setLastCoords({ x, y });
  }

  function MouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!CanvasRef.current) return;
    const { x, y } = getCanvasCoord(e);
    Hover(x, y, action, CanvasRef.current, elements, selectedElements);
    if (action === "DRAWING" && draftElement) {
      draftElement.updateDraftCoords(x, y);
      redraw();
    } else if (currentTool === "select") {
      if (action == "SELECTING") {
        setSelectionArea((prev) => ({
          ...prev,
          x2: x,
          y2: y,
          width: x - prev.x1,
          height: y - prev.y1,
        }));
        ScanElements();
        redraw();
      }else if(action==='MOVING'){
        selectedElements.forEach((element) => element.move(x,y,lastCoords));
        redraw();
      }else if (action==='SCALING'&&scaleType){
        selectedElements.forEach((element) => element.scale(x,y,lastCoords,scaleType));
        redraw();
      }else if (action==='ROTATING'){
        selectedElements.forEach((element) => element.rotate(x,y,lastCoords));
        redraw();
      }
    }
    setLastCoords({ x, y });
  }

  function ScanElements() {
    const e = [];
    for (const element of elements) {
      if (selectionCollision(element, selectionArea)) {
        e.push(element);
      }
    }
    setSelectedElements(e);
  }

  function MouseUp() {
    // const { x, y } = getCanvasCoord(e);
    if (action === "DRAWING" && draftElement) {
      setElements([...elements, draftElement]);
      setDraftElement(null);
      setAction("IDLE");
      setCurrentTool("select");
    } else if (currentTool === "select") {
      if (action === "SELECTING") {
        ScanElements();
        const nextAction = selectedElements.length > 0 ? "SELECTED" : "IDLE";
        setSelectionArea({ x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0 });
        setAction(nextAction);
        console.log(nextAction);
        redraw();
      }else if (action ==='MOVING'){
        setAction("SELECTED")
      }else if (action === 'SCALING'||action==='ROTATING'){
        setAction("SELECTED")
        setScaleType(null)
      }
    }
  }

  useEffect(() => {
    redraw();
  }, [elements, draftElement, selectionArea, action, selectedElements]);

  function getCanvasCoord(e: MouseEvent<HTMLCanvasElement>) {
    if (!CanvasRef.current) return { x: 0, y: 0 };
    const rect = CanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
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
