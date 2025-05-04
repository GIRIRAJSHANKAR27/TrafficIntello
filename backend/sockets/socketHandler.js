import { Server } from "socket.io";
import registerListener  from "../redis/subscriber.js";

let ioInstance;

const setupWebSocket = (server) => {
    console.log("Setting up WebSocket server");
  const io = new Server(server, {
    cors: { origin: "*" }
  });
  
  ioInstance = io;
  if(!io) {
    console.error("WebSocket server not initialized");
    return;
  }
    console.log("WebSocket server initialized");
  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("subscribe", (data) => {
      const {junctionId } = data;
      socket.join(junctionId);
      console.log(`Client subscribed to ${junctionId}`);

     
      registerListener(junctionId, (junctionId, signalState) => {
        console.log(`Received signal state for ${junctionId}:`, signalState);
        io.to(junctionId).emit("signalUpdate", { junctionId, signalState });
      },socket);
    });
  });
};

export default  setupWebSocket ;
