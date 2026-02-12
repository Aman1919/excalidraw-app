import { v4 as uuidv4 } from 'uuid';
import  {WebSocket } from "ws";

export default class Room{
    rooms:{groupId:string,admin:{ws:WebSocket,username:string},canvas:string,joiners:{username:string,ws:WebSocket}[]}[] = []

createRoom(ws:WebSocket,username:string,canvas:string){
const groupId = uuidv4()
const room = {groupId,admin:{ws,username},canvas,joiners:[]}
this.rooms.push(room)
ws.send(JSON.stringify({type:"room-created",status:200,data:{groupId,username,canvas}}))
}

addJoiners(ws:WebSocket,groupId:string,username:string){
const room =this.rooms.find((r)=>{
r.groupId===groupId;
})
if(room){
    room.joiners.push({username,ws})
    ws.send(JSON.stringify({room,status:200}))
}else{
    ws.send(JSON.stringify({message:"incorrect link",status:404}))
}
}

handleConnection(groupId:string|null,ws:WebSocket,username:string,canvas:string|null){
if(!groupId){
    if(canvas)this.createRoom(ws,username,canvas)
}else{
    this.addJoiners(ws,groupId,username)
}
}


    handleMessage(){

    }
}