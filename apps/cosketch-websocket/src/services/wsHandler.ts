import WebSocket from "ws";
import { joinRoom, leaveRoom } from "./roomManager";
import { saveStroke, clearCanvas, undoStroke } from "./canvasHandler";
import { logger } from "../utils/logger";

export const handleMessage = async (
  ws: WebSocket,
  userId: string,
  data: string,
  clients: Map<string, WebSocket>
) => {
  try {
    const parsedData = JSON.parse(data);

    switch (parsedData.type) {
      case "join_room":
        await joinRoom(userId, parsedData.roomId);
        ws.send(
          JSON.stringify({ type: "joined_room", roomId: parsedData.roomId })
        );
        break;

      case "leave_room":
        await leaveRoom(userId, parsedData.roomId);
        ws.send(
          JSON.stringify({ type: "left_room", roomId: parsedData.roomId })
        );
        break;

      case "stroke":
        await saveStroke(parsedData.roomId, userId, parsedData.stroke);
        broadcast(clients, parsedData.roomId, userId, {
          type: "stroke",
          stroke: parsedData.stroke,
        });
        break;

      case "clear":
        await clearCanvas(parsedData.roomId);
        broadcast(clients, parsedData.roomId, userId, { type: "clear" });
        break;

      case "undo":
        const lastStroke = await undoStroke(parsedData.roomId, userId);
        // if (lastStroke) {
        //   broadcast(clients, parsedData.roomId, userId, {
        //     type: "undo",
        //     strokeId: lastStroke.id,
        //   });
        // }
        break;

      default:
        logger.warn("Unknown event type:", parsedData.type);
    }
  } catch (err) {
    logger.error("Message handling error:", err);
  }
};

const broadcast = (
  clients: Map<string, WebSocket>,
  roomId: string,
  senderId: string,
  message: any
) => {
  clients.forEach((client, clientId) => {
    if (clientId !== senderId) {
      client.send(JSON.stringify({ ...message, roomId }));
    }
  });
};
