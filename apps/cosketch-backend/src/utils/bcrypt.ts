import bcrypt from "bcrypt";

// use hashPassword
// const hashedPassword = await hashPassword(userPassword);

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

//  verifyPassword
// const isMatch = await verifyPassword("mypassword123", hashedPassword);
export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
