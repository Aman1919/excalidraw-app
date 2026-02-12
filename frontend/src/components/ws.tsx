import {useEffect,useRef} from "react";

type UseWsProps = {
    isLive:boolean
    canvasData:string,
setCollaborationData:(data:string)=>void,

}

export default function useWS({isLive,canvasData,setCollaborationData}:UseWsProps){
    const url = `ws://localhost:8080?canvas=${canvasData}`;
    const wsRef = useRef<WebSocket>(null)
    
    useEffect(()=>{
     if(!isLive)return   
    const ws = new WebSocket(url);
    wsRef.current = ws
    ws.onopen = ()=>{
        console.log('connected');
    }
    ws.onmessage = e =>{
        const data = JSON.parse(e.data);
if(data.type==='room-created'){
    console.log("Room created with ID:", data.data.groupId);
    setCollaborationData(e.data)
}
    }
    ws.onerror = err =>{
        console.log("error",err);
    }
    ws.onclose = () =>{
     console.log('close connection')
    }
    
    },[isLive])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function send(msg: any) {
    wsRef.current?.send(JSON.stringify(msg));
  }

  return { send, ws: wsRef };

}