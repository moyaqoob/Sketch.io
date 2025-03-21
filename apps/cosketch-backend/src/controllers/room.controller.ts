import { type Request, type Response } from "express";
import { HttpStatus } from "../utils/HttpStatus";

export const createRoom = (req: Request, res: Response) => {
  res.status(HttpStatus.SUCCESS).json({
    success: true,
    message: "room Created",
  });
};

export const joinRoom = (req: Request, res: Response) => {
  res.status(HttpStatus.SUCCESS).json({
    success: true,
    message: "room joined",
  });
};

export const leaveRoom = (req: Request, res: Response) => {
  res.status(HttpStatus.SUCCESS).json({
    success: true,
    message: "room leaved",
  });
};
