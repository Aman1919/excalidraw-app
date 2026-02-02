import {useRef,useEffect,useState} from "react"
import DrawEngine from "./DrawEngine"

type CanvasProps = {
  currentTool:string,
  setCurrentTool: (tool: string) => void;
};

export default function Canvas({currentTool,setCurrentTool}:CanvasProps) {
    const CanvasRef = useRef<HTMLCanvasElement|null>(null)
    const [draw,setDraw]=useState<DrawEngine | null>(null)
    useEffect(()=>{
     if(!CanvasRef)return;
     const canvas = CanvasRef.current;
     if(!canvas)return
     const ctx  = canvas.getContext('2d')
     if(!ctx)return
    setDraw(new DrawEngine(ctx,canvas,currentTool,setCurrentTool))
    },[CanvasRef])

    useEffect(()=>{
    if(!draw)return
    draw.updateCurrentTool(currentTool)
    },[currentTool, draw])


    return <canvas 
    ref={CanvasRef} 
    onMouseDown={(e)=>draw?.mouseAction('mousedown',e)} 
    onMouseMove={(e)=>{draw?.mouseAction('mousemove',e)}} 
    onClick={(e)=>draw?.mouseAction('click',e)} 
    onMouseUp={(e)=>draw?.mouseAction('mouseup',e)}
    onDoubleClick={(e)=>draw?.mouseAction('doubleclick',e)}
    ></canvas>
}