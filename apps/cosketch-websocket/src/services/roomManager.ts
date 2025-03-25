// import db from "../config/database";

export const joinRoom = async (userId: string, roomId: string) => {
  //   await db.room.upsert({
  //     where: { id: roomId },
  //     update: { users: { connect: { id: userId } } },
  //     create: { id: roomId, users: { connect: { id: userId } } },
  //   });
};

export const leaveRoom = async (userId: string, roomId: string) => {
  //   await db.room.update({
  //     where: { id: roomId },
  //     data: { users: { disconnect: { id: userId } } },
  //   });
};
