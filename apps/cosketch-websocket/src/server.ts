import { WebSocketServer } from "ws";
import { PORT } from "./config";

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (socket) => {
  console.log("user connected");
  socket.send("hello");
});
