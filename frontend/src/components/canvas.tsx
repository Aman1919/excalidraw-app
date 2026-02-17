import {
  useRef,
  useState,
  useEffect,
  type MouseEvent,
  useLayoutEffect,
} from "react";
import { type Actions, isElementType ,type Element} from "../type";
import {createElement, moveElement, scaleElement, updateDraftCoords} from "./element";
import rough from "roughjs";
import { Hover, HoverOverSelectedElements,HoverOverAllElements, HoverOverSelectionBorder } from "./hover";
import { pointElementCollision, selectionCollision } from "./collision";
import { drawElement, groupSelection } from "./draw";
import { useRecoilValue, useRecoilState } from "recoil";
import { elementState, selectedElementState, currentToolState ,styleUpdateState, scaleTypeState, groupIdState,collaboratorsState} from "../atoms/index.tsx";
import useWS from "./ws.tsx";
import { DrawCursor } from "./cursor.tsx";


export default function Canvas() {
  const CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elements, setElements] = useRecoilState(elementState);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [selectedElements, setSelectedElements] = useRecoilState(selectedElementState);
  const [currentTool,setCurrentTool] = useRecoilState(currentToolState);
  const [action, setAction] = useState<Actions>("IDLE");
  const [scaleType,setScaleType] = useRecoilState(scaleTypeState)
  const [draftElement, setDraftElement] = useState<Element | null>(null);
  const styleUpdate = useRecoilValue(styleUpdateState)
  const groupId = useRecoilValue(groupIdState)
  const [selectionArea, setSelectionArea] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
  });
  const [text,setText]=useState("");
  const [lastCoords, setLastCoords] = useState({ x: 0, y: 0 });
  const [textCoords, setTextCoords] = useState({ x: 0, y: 0 });
  const [trashElement,setTrashElement]=useState<string[]>([])
  const collaborators = useRecoilValue(collaboratorsState)
  const {send}=useWS()

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
    const elements = localStorage.getItem("elements");
    if (elements) {
      setElements(JSON.parse(elements));
    }
  }, [CanvasRef, setElements]);

  function redraw() {
    const canvas = CanvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1d1d24";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const rctx = rough.canvas(canvas);

    elements.forEach((el) => drawElement(el, rctx, ctx));
    if(draftElement)drawElement(draftElement, rctx, ctx)
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
    groupSelection(rctx, getSelectedElement());
    collaborators.forEach(collab=>{
    DrawCursor(collab.mouseCoords.x,collab.mouseCoords.y,collab.color,collab.username,rctx,ctx)
    })
  }
 
  function getSelectedElement(){
   const sEl = elements.filter((el) => selectedElements.includes(el.id));
    return sEl;
  }

  function MouseDown(e: MouseEvent<HTMLCanvasElement>) {
    if (!CanvasRef.current||!ctxRef.current) return;

    const { x, y } = getCanvasCoord(e);
    send({type:"mouse-down",x,y,groupId,currentTool})
    const el = Hover(
      x,
      y,
      action,
      CanvasRef.current,
      elements,
      getSelectedElement(),
    );
    
    const hoverSelectionBorder = HoverOverSelectionBorder(x,y,getSelectedElement(),CanvasRef.current)
    if(currentTool==='text'&&action==='WRITING'&&text.length>0){
      const textElement=  createElement(x,y,x,y,"text")
      setText(text)
     setElements([...elements,textElement])
     setTextCoords({x:0,y:0});
     setText("")
     setAction("IDLE")
     redraw()
     return;
    }
    if(currentTool==='trash'){
      //

          setSelectedElements([])
        setSelectionArea({x1: 0,y1: 0,x2: 0,y2: 0,width: 0,height: 0})
     CanvasRef.current.style.cursor='cell'
     setAction("DELETING")
     return;
    }
    if (currentTool!=='text'&&isElementType(currentTool) && CanvasRef.current) {
      setDraftElement(createElement(x, y, x, y, currentTool));
      setAction("DRAWING");
      return;
    }
    if (currentTool === "select") {
      console.log(el);
      if (action == "SELECTED") {
        if (HoverOverSelectedElements(x, y, getSelectedElement())) {
          setAction("MOVING");
        }else if(hoverSelectionBorder){
          if(hoverSelectionBorder.message!=='rotate'){
            setAction('SCALING')
            setScaleType(hoverSelectionBorder.message)
          }else{
            setAction('ROTATING')
            setScaleType(hoverSelectionBorder.message)
          }
        }else if (!el){
          //clicked outside the selected element
        setAction("IDLE");
        setSelectedElements([])
        setSelectionArea({x1: 0,y1: 0,x2: 0,y2: 0,width: 0,height: 0})
        }
      } else if (!el && action) {
        setAction("SELECTING");
        setSelectionArea({ x1: x, y1: y, x2: x, y2: y, width: 0, height: 0 });
      }
    }
    setLastCoords({ x, y });
  }

  function MouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (!CanvasRef.current||!ctxRef.current) return;
    
    const { x, y } = getCanvasCoord(e);
    send({type:"mouse-move",x,y,groupId})
    Hover(x, y, action, CanvasRef.current, elements, getSelectedElement());
    if(currentTool==='trash'){
     CanvasRef.current.style.cursor='cell'
    }
    if(action==='DELETING'){
      const arr:string[] = []
      elements.forEach((el) => {
        if(pointElementCollision(x,y,el)){
          arr.push(el.id)
        }
      });
  ctxRef.current.fillStyle = "white";
  ctxRef.current.beginPath();
  ctxRef.current.arc(x, y, 7, 0, Math.PI * 2);
  ctxRef.current.fill();
      setTrashElement(arr)
      redraw();
      return;
    }
    if (action === "DRAWING" && draftElement) {
      setDraftElement(updateDraftCoords(draftElement, x, y));
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
        setElements((prev) =>prev.map((element)=> selectedElements.includes(element.id)?moveElement(element,x,y,lastCoords):element))
        redraw();
      }else if (action==='SCALING'&&scaleType&&scaleType!=='rotate'){
        setElements((prev) =>prev.map((element)=> selectedElements.includes(element.id)?scaleElement(element,x,y,lastCoords,scaleType):element))
        redraw();
      }else if (action==='ROTATING'){
        // selectedElements.forEach((element) => rotateElement(element,x,y,lastCoords));
        // redraw();
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
    setSelectedElements(e.map((el) => el.id));
  }

  function MouseUp(e: MouseEvent<HTMLCanvasElement>) {
    if(!CanvasRef.current)return;
    const { x, y } = getCanvasCoord(e);
    send({type:"mouse-up",x,y,groupId,currentTool})
    const el = HoverOverAllElements(x,y,elements,CanvasRef.current);
    if(action==='DELETING'){
      const els = elements.filter((el)=>trashElement.some((tel)=>el.id!==tel))
      setElements(els)
    localStorage.setItem("elements", JSON.stringify(els));
      setAction('IDLE')
      redraw();
      return;
    }
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
      }else if(el){
        setSelectedElements([el.id])
        setAction("SELECTED")
      }
    }
    localStorage.setItem("elements", JSON.stringify(elements));
  }

  function doubleClick(e: MouseEvent<HTMLCanvasElement>){
    if(currentTool!=='text')return;
    const {x,y}= getCanvasCoord(e);
    setAction('WRITING')
    setTextCoords({x,y});
  }


  useEffect(() => {
    redraw();
  }, [elements, draftElement, selectionArea, action, selectedElements,styleUpdate,collaborators]);


  function getCanvasCoord(e: MouseEvent<HTMLCanvasElement>) {
    if (!CanvasRef.current) return { x: 0, y: 0 };
    const rect = CanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  }

  

  return (
    <>
     {action === "WRITING" ? (
        <input
          className="textArea"
          style={{top:textCoords.y,left:textCoords.x}}
          onChange={(e)=>{setText(e.target.value)}}
        />
      ) : null}
    <canvas
      ref={CanvasRef}
      onMouseDown={MouseDown}
      onMouseMove={MouseMove}
      onMouseUp={MouseUp}
      onDoubleClick={doubleClick}
      ></canvas>
      </>
  );
}