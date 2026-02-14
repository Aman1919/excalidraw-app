import  {WebSocket, WebSocketServer } from "ws";
import Room from "./Rooms";

const wss = new WebSocketServer({ port: 8080 });

const rooms = new Room();

wss.on("connection", (ws,req) => {
  console.log("Client connected");

  ws.on("message",(message)=>{
rooms.handleMessage(ws,message.toString())
  })

});


function createRandomUsernames(){
  const adjectives = ["Swift", "Brave", "Clever", "Mighty", "Gentle"];
  const animals = ["Lion", "Eagle", "Shark", "Wolf", "Panther"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adjective}${animal}`;
}

console.log("WS server running on ws://localhost:8080");
