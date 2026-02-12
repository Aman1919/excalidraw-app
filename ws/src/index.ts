import  {WebSocket, WebSocketServer } from "ws";
import Room from "./Rooms";

const wss = new WebSocketServer({ port: 8080 });

const rooms = new Room();

wss.on("connection", (ws,req) => {
  console.log("Client connected");
const params = new URLSearchParams(req.url?.split('?')[1]);
const groupId = params.get('groupId');
const username = createRandomUsernames();
const canvas = params.get('canvas')||"";

rooms.handleConnection(groupId,ws,username,canvas)
  

  ws.send("Hello from server");
});


function createRandomUsernames(){
  const adjectives = ["Swift", "Brave", "Clever", "Mighty", "Gentle"];
  const animals = ["Lion", "Eagle", "Shark", "Wolf", "Panther"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adjective}${animal}`;
}

console.log("WS server running on ws://localhost:8080");
