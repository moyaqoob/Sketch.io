import { type Request, type Response } from "express";
import { Status } from "../utils/statusCode";

export const signup = (req: Request, res: Response) => {};

export const signin = (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(Status.ServerError).json({
      success: false,
      message: "Server Error",
    });
  }
};
