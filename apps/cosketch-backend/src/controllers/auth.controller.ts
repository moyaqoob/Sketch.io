import { type Request, type Response } from "express";
import { HttpStatus } from "../utils/HttpStatus";
import { createUser } from "@repo/database";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { CreateUserSchema, SigninSchema } from "@repo/types";
import { getUserByEmail } from "@repo/database";
import { generateToken } from "../utils/jwt";

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
    const userExist = await getUserByEmail(email);
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

export const signin = async (req: Request, res: Response) => {
  try {
    // Validate input
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: parsedData.error.errors,
      });
    }

    const { email, password } = parsedData.data;

    // Fetch user from database
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Compare passwords
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Send response
    return res.status(HttpStatus.SUCCESS).json({
      success: true,
      message: "Signin successful",
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Internal server error",
    });
  }
};
