// import db from "../config/database";

export const saveStroke = async (
  roomId: string,
  userId: string,
  strokeData: any
) => {
  //   return await db.canvasStroke.create({
  //     data: { roomId, userId, data: strokeData },
  //   });
};

export const clearCanvas = async (roomId: string) => {
  //   return await db.canvasStroke.deleteMany({ where: { roomId } });
};

export const getStrokes = async (roomId: string) => {
  //   return await db.canvasStroke.findMany({ where: { roomId } });
};

export const undoStroke = async (roomId: string, userId: string) => {
  //   const lastStroke = await db.canvasStroke.findFirst({
  //     where: { roomId, userId },
  //     orderBy: { createdAt: "desc" },
  //   });
  //   if (lastStroke) {
  //     await db.canvasStroke.delete({ where: { id: lastStroke.id } });
  //     return lastStroke;
  //   }
  //   return null;
};
