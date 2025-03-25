import {
  getUserByEmail,
  createUser,
  getUserById,
} from "./src/services/userService";

export { getUserByEmail, createUser, getUserById };

import {
  createRoom,
  getRoomByName,
  getRoomsByUserId,
  getRoomWithUsersById,
  deleteRoom,
  removeUserFromRoom,
  getRoomWithUsers,
  connectUserWithRoom,
} from "./src/services/roomService";

export {
  createRoom,
  getRoomByName,
  getRoomsByUserId,
  deleteRoom,
  removeUserFromRoom,
  getRoomWithUsersById,
  getRoomWithUsers,
  connectUserWithRoom,
};

import { deleteUserCanvasInRoom } from "./src/services/canvasService";

export { deleteUserCanvasInRoom };
