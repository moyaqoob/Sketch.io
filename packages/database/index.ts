import {
  getUserByEmail,
  createUser,
  getUserById,
} from "./src/services/userService";

export { getUserByEmail, createUser, getUserById };

import {
  createRoom,
  getRoomById,
  getRoomsByUserId,
  getRoomWithUsersById,
  deleteRoom,
  removeUserFromRoom,
} from "./src/services/roomService";

export {
  createRoom,
  getRoomById,
  getRoomsByUserId,
  deleteRoom,
  removeUserFromRoom,
  getRoomWithUsersById,
};
