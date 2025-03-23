import client from "..";

export const createRoom = async (name: string, userId: string) => {
  return await client.room.create({
    data: {
      slug: name,
      adminId: userId,
      users: {
        connect: [{ id: userId }], // Automatically connect the admin as a member
      },
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
  return await client.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      rooms: {
        select: {
          id: true,
          slug: true,
          createdAt: true,
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};
