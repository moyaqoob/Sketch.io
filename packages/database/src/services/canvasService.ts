import client from "..";

export const createCanvas = () => {};

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
