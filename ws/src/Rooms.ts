import { v4 as uuidv4 } from 'uuid';
import  {WebSocket } from "ws";

export default class Room{
    rooms:{groupId:string,admin:{ws:WebSocket,color:string,username:string},canvas:string,joiners:{username:string,color:string,ws:WebSocket}[]}[] = []

createRoom(ws:WebSocket,canvas:string){
const groupId = uuidv4()
const username = this.createRandomUsernames()
const color = this.generateRandomColor()
const room = {groupId,admin:{ws,username,color},canvas,joiners:[]}
this.rooms.push(room)
ws.send(JSON.stringify({type:"room-created",status:200,data:{groupId,username,canvas}}))
}

addJoiners(ws:WebSocket,groupId:string){
    const room =this.rooms.find((r)=> r.groupId===groupId)
const username = this.createRandomUsernames()
const color = this.generateRandomColor()
    if(room){
        room.joiners.push({username,ws,color})

        const data = {
            username,
            color,
            admin: {username: room.admin.username, color: room.admin.color},
            joiners: room.joiners
                .filter(j => j.ws !== ws) 
                .map(j => ({username: j.username, color: j.color})),
            canvas: room.canvas
        }

        room.admin.ws.send(JSON.stringify({type:"new-joiner",username,color,status:200}))
        room.joiners.forEach(joiner => {
                joiner.ws.send(JSON.stringify({type:"new-joiner",username,color,status:200}))
            
        });
        ws.send(JSON.stringify({type:"room-joined",...data,status:200}))
    }else{
        ws.send(JSON.stringify({message:"incorrect link",status:404}))
    }
    console.log(this.rooms)
}



    handleMessage(ws:WebSocket,message:string){
        const {type,canvas,groupId} = JSON.parse(message)
        if(type==="create-room"){
            this.createRoom(ws,canvas)
        }else if(type==="join-room"){
            this.addJoiners(ws,groupId)
        }else if(type==='mouse-move'){
            this.mouseMove(ws,groupId,message);
        }else if(type==='mouse-down'){
            this.mouseDownUp(ws,groupId,message)
        }
        else if(type==='mouse-up'){
            this.mouseDownUp(ws,groupId,message)
        }
    }

    mouseDownUp(ws:WebSocket,groupId:string,message:string){
        const {x,y,type} = JSON.parse(message)
        const room = this.rooms.find((r)=> r.groupId===groupId)
        if(room){
                const data = room.admin.ws===ws?room.admin: room.joiners.find(j=>j.ws===ws)
                const user = {username:data?.username,color:data?.color,message}
                room.joiners.forEach(joiner => {
                    if(joiner.ws!==ws){
                     joiner.ws.send(JSON.stringify({type,x,y,user}))
                    }
                });
                if(room.admin.ws!==ws){
                     room.admin.ws.send(JSON.stringify({type,x,y,user}))
                }
            }
    }

    

    mouseMove(ws:WebSocket,groupId:string,message:string){
        const {x,y} = JSON.parse(message)
        const room = this.rooms.find((r)=> r.groupId===groupId)
        if(room){
                const data = room.admin.ws===ws?room.admin: room.joiners.find(j=>j.ws===ws)
                const user = {username:data?.username,color:data?.color,message}
                room.joiners.forEach(joiner => {
                    if(joiner.ws!==ws){
                     joiner.ws.send(JSON.stringify({type:"mouse-move",x,y,user}))
                    }
                });
                if(room.admin.ws!==ws){
                     room.admin.ws.send(JSON.stringify({type:"mouse-move",x,y,user}))
                }
            }
    }

     createRandomUsernames(){
  const adjectives = ["Swift", "Brave", "Clever", "Mighty", "Gentle"];
  const animals = ["Lion", "Eagle", "Shark", "Wolf", "Panther"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adjective}${animal}`;
}
generateRandomColor() {
  const hue = Math.floor(Math.random() * 360); // 0–360
  const saturation = 70; // strong colors
  const lightness = 55; // readable brightness

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

close(ws:WebSocket){
    ws.on("close",()=>{
  this.rooms.forEach(room=>{
    room.joiners = room.joiners.filter(j=>j.ws!==ws);
  });
});
}
}