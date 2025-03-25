import { WebSocket } from "ws";
import { logger } from "../utils/logger";
import { deleteUserCanvasInRoom } from "@repo/database";
import {
  addUserToRoom,
  isUserInRoom,
  rooms,
  removeUser,
  broadcastToRoom,
} from "../utils/roomManager";

export const handleRoomEvent = (
  socket: WebSocket,
  message: { type: string; room: string },
  userId: string
) => {
  const { type, room } = message;

  switch (type) {
    case "join_room":
      addUserToRoom(socket, room);
      logger.info(`User ${userId} joined room ${room}`);
      broadcastToRoom(room, {
        type: "user_joined",
        message: { type: "user_joined", message: `User ${userId} joined` },
      });
      break;

    case "leave_room":
      removeUserFromRoom(socket, room, userId, true);
      break;
  }
};

// Option 1: Handle Normal Disconnect (Keep Canvas)
export const handleUserDisconnect = (socket: WebSocket, userId: string) => {
  for (const room in rooms) {
    if (isUserInRoom(socket, room)) {
      removeUserFromRoom(socket, room, userId, false);
    }
  }
};

// Option 2: Full Leave (Remove User + Canvas)
export const handleUserLeaveCompletely = async (
  socket: WebSocket,
  userId: string
) => {
  for (const room in rooms) {
    if (isUserInRoom(socket, room)) {
      await removeUserFromRoom(socket, room, userId, true);
    }
  }
};

// Remove User from Room (Optional Canvas Removal)
const removeUserFromRoom = async (
  socket: WebSocket,
  room: string,
  userId: string,
  removeCanvas: boolean
) => {
  if (!rooms[room]) {
    logger.warn(`User ${userId} tried to leave non-existent room: ${room}`);
    socket.send(
      JSON.stringify({ type: "error", message: "Room does not exist." })
    );
    return;
  }

  removeUser(socket, room);
  logger.info(`User ${userId} left room ${room}`);

  if (removeCanvas) {
    try {
      const response = await deleteUserCanvasInRoom(room, userId);
      if (response) {
        logger.info(`User ${userId}'s canvas removed from room ${room}`);
      } else {
        logger.warn(`No canvas found for user ${userId} in room ${room}`);
      }
    } catch (error) {
      logger.error(`Failed to remove canvas for user ${userId}:`, error);
    }
  }

  cleanupRoom(room);
};

// Remove Room if Empty
const cleanupRoom = (room: string) => {
  if (rooms[room] && rooms[room].size === 0) {
    delete rooms[room];
    logger.info(`Room ${room} deleted (no users left).`);
  } else {
    broadcastToRoom(room, {
      type: "user_left",
      message: `A user left the room`,
    });
  }
};

// Broadcast Message to All Users in a Room
// const broadcast = (room: string, message: object) => {
//   if (!rooms[room]) return;
//   for (const client of rooms[room]) {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(message));
//     }
//   }
// };
