import { client } from "..";

export const createCanvas = async (
  roomId: string,
  userId: string,
  design: string
) => {
  return await client.canvas.create({
    data: {
      roomId,
      userId,
      design,
    },
  });
};

export const deleteUserCanvasInRoom = async (
  roomid: string,
  userId: string
) => {
  const existingCanvas = await client.canvas.findFirst({
    where: { roomId: roomid, userId },
  });

  if (!existingCanvas) {
    return null;
  }

  return await client.canvas.deleteMany({ where: { roomId: roomid, userId } });
};

export const clearRoomCanvas = async (roomId: string) => {
  const existingCanvas = await client.canvas.findMany({
    where: { roomId },
  });

  if (existingCanvas.length === 0) {
    return null;
  }

  return await client.canvas.deleteMany({
    where: { roomId },
  });
};

export const getRoomCanvas = async (roomId: string) => {
  return await client.canvas.findMany({
    where: { roomId },
    take: 50,
    orderBy: { createdAt: "desc" },
  });
};
