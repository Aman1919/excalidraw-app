import { useEffect, useRef } from "react";
import { collaboratorsState, elementState, groupIdState, isLiveState,updateCursorSelector } from "../atoms";
import { useRecoilState } from "recoil";

export default function useWS() {
  const wsRef = useRef<WebSocket>(null);
  const [elements, setElements] = useRecoilState(elementState);
  const [groupId, setGroupId] = useRecoilState(groupIdState);
  const [isLive, setIsLive] = useRecoilState(isLiveState);
  const [collaborators, setCollaborators] = useRecoilState(collaboratorsState);
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
      if (data.type === "room-created") {
        setGroupId(data.data.groupId);
      } else if (data.type === "room-joined") {
        console.log(data)
        setElements(data.canvas);
        setCollaborators([{ username: data.admin.username, color:data.admin.color,mouseCoords:{x:0,y:0} }, ...data.joiners.map(j => ({ username: j.username, color: j.color ,mouseCoords:{x:0,y:0}}))]);
        setIsLive("joined");
      }else if(data.type==="cursor-move"){
        console.log("cursor move data",data)
        updateCursorSelector({username:data.user.username,x:data.x,y:data.y})
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


