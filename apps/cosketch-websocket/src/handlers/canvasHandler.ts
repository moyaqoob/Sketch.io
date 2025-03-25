import { WebSocket } from "ws";
import { logger } from "../utils/logger";

export const handleCanvasEvent = (
  // socket: WebSocket,
  message: any,
  userId: string
) => {
  const { type, room, data } = message;

  switch (type) {
    case "draw_canvas":
      // broadcastCanvas(room, { type: "draw", userId, data });
      break;

    case "clear":
      // broadcastCanvas(room, {
      //   type: "clear_canvas",
      //   message: `User ${userId} cleared the canvas`,
      // });
      break;

    default:
      logger.warn(`Unknown canvas event: ${type}`);
  }
};

// // Broadcast drawing updates to users in the same room
// const broadcastCanvas = (room: string, message: any) => {
//   if (canvasRooms[room]) {
//     canvasRooms[room].forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(message));
//       }
//     });
//   }
// };
