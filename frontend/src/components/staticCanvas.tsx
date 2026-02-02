import {useRef,useEffect} from "react"

export default function Canvas() {
    const CanvasRef = useRef<HTMLCanvasElement|null>(null)

    useEffect(()=>{
     if(!CanvasRef)return;
     const canvas = CanvasRef.current;
     if(!canvas)return
     const ctx  = canvas.getContext('2d')
     if(!ctx)return
    //  this.ctx.fillRect(0,0,window.innerWidth,window)
    },[CanvasRef])

    return <canvas ref={CanvasRef}></canvas>
}