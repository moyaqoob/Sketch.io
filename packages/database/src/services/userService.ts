import client from "..";

export const createUser = async (
  email: string,
  hashedPassword: string,
  name: string
) => {
  return client.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return await client.user.findUnique({
    where: {
      email,
    },
  });
};
