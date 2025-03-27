import { WebSocketServer } from "ws";
import { authenticateWebSocket } from "../services/auth";
import { getToken } from "../services/getToken";
import { handleRoomEvent, removeUserFromRoom } from "./roomHandler";
import { handleCanvasEvent } from "./canvasHandler";
import { logger } from "../utils/logger";
import { PORT } from "../config";
import { rooms, isUserInRoom } from "../utils/roomManager";

export const setupWebSocketServer = (wss: WebSocketServer) => {
  wss.on("connection", (socket, request) => {
    const url = request.url;
    if (!url) {
      logger.error("Connection request missing URL");
      socket.close();
      return;
    }

    const token = getToken(url);
    const userAuthenticated = authenticateWebSocket(token);

    if (!userAuthenticated) {
      logger.warn("Unauthorized WebSocket connection attempt");
      socket.close();
      return;
    }

    const userId = userAuthenticated.id;
    logger.info(`User ${userId} connected`);

    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "join_room":
          case "leave_room":
            handleRoomEvent(socket, message, userId);
            break;

          case "draw_canvas":
          case "clear_canvas":
          case "eraser":
          case "update":
            // handleCanvasEvent(socket, message, userId);
            handleCanvasEvent(socket, message, userId);
            break;

          default:
            logger.warn(`Unknown message type received: ${message.type}`);
        }
      } catch (error) {
        logger.error("Invalid message format", error);
      }
    });

    socket.on("close", () => {
      logger.info(`User ${userId} disconnected`);

      for (const room in rooms) {
        if (isUserInRoom(socket, room)) {
          removeUserFromRoom(socket, room, userId, false);
          logger.info(`User ${userId} removed from room ${room}`);
        }
      }
    });
  });

  wss.on("listening", () => {
    logger.info(`WebSocket server is running on ws://localhost:${PORT}`);
  });
};
