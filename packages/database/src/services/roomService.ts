import client from "..";

export const createRoom = async (name: string, userId: string) => {
  return await client.room.create({
    data: {
      slug: name,
      adminId: userId,
    },
  });
};

export const getRoomById = async (roomName: string) => {
  return await client.room.findFirst({
    where: {
      slug: roomName,
    },
  });
};

export const getRoomsByUserId = async (userId: string) => {
  return await client.room.findMany({
    where: {
      adminId: userId,
    },
  });
};
