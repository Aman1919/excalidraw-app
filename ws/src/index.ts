import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const rooms = []
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    console.log("received:", data.toString());

    // broadcast
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.send("Hello from server");
});

/**
 * in coballoration feature 
 * we colaborating with multiple people
 * when user clicka start colab it creates a rooms and give the user a rooms link 
 * where multiple people can join and colal with drawing 
 * first it will the the drawing data to room owner and it will share it with others as well 
 * coverting drawing data to string 
 */

console.log("WS server running on ws://localhost:8080");
