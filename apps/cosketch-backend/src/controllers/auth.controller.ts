import { type Request, type Response } from "express";
import { HttpStatus } from "../utils/HttpStatus";
import { createUser, getUserByUsername } from "@repo/database";
import { hashPassword } from "../utils/bcrypt";
import { CreateUserSchema } from "@repo/types";

export const signup = async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: parsedData.error.errors,
      });
      return;
    }

    const { email, password, name } = parsedData.data;

    // check if user exist already or not
    const userExist = await getUserByUsername(email);
    if (userExist) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: "Username already taken" });
      return;
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // create user
    const newUser = await createUser(email, hashedPassword, name);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: "Internal server error" });
    return;
  }
};

export const signin = (_req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};
