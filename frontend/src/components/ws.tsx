import { useEffect, useRef } from "react";
import { collaboratorsState,  elementState, groupIdState, isLiveState} from "../atoms";
import { useRecoilState} from "recoil";

export default function useWS() {
  const wsRef = useRef<WebSocket>(null);
  const [elements, setElements] = useRecoilState(elementState);
  const [groupId, setGroupId] = useRecoilState(groupIdState);
  const [isLive, setIsLive] = useRecoilState(isLiveState);
  const  setCollaborators = useRecoilState(collaboratorsState)[1];
  useEffect(() => {
    console.log("ws effect", isLive, wsRef.current);
    if (!isLive) return;
    console.log("initializing ws connection");
    const url = `ws://localhost:8080`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => {
      console.log("connected");
      if (!groupId) {
        ws.send(JSON.stringify({ type: "create-room", canvas: elements }));
      } else {
        console.log("joining room with id", groupId);
        ws.send(JSON.stringify({ type: "join-room", groupId }));
      }
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const ranX= ()=>Math.floor(Math.random() * window.innerWidth);
      const ranY= ()=>Math.floor(Math.random() * window.innerHeight);
      if (data.type === "room-created") {
        setGroupId(data.data.groupId);
      } else if (data.type === "room-joined") {
            console.log(data);
    setElements(data.canvas);
    // Only set collaborators for the person who just joined
    setCollaborators([
      { username: data.admin.username, color: data.admin.color, mouseCoords: {x: ranX(), y: ranY()} }, 
      ...data.joiners.map((j: { username: string; color: string; }) => ({ 
        username: j.username, 
        color: j.color, 
        mouseCoords: {x: ranX(), y: ranY()}
      }))
    ]);
    setIsLive("joined");

      }else if(data.type==="mouse-move"){
        console.log("cursor move data",data)
        setCollaborators(prev =>
  prev.map(u =>
    u.username === data.user.username
      ? { ...u, mouseCoords: { x: data.x, y: data.y } }
      : u
  )
);
      }else if(data.type==="new-joiner"){
 setCollaborators(prev => {
      const alreadyExists = prev.some(u => u.username === data.username);
      if (alreadyExists) {
        return prev; // Don't add duplicate
      }
      return [...prev, {
        username: data.username, 
        color: data.color, 
        mouseCoords: {x: ranX(), y: ranY()}
      }];
    });
      }else if(data.type==='mouse-down'){
        // handle mouse down if needed
      }else if (data.type==='mouse-up'){  
        // handle mouse up if needed
      }
    };
    ws.onerror = (err) => {
      console.log("error", err);
    };
    ws.onclose = () => {
      console.log("close connection");
      setIsLive(null);
    };
  }, [isLive]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function send(msg: any) {
    wsRef.current?.send(JSON.stringify(msg));
  }

  return { send, ws: wsRef };
}


