import type { Request, Response } from "express";
import { HttpStatus } from "../utils/HttpStatus";
import { CreateRoomSchema } from "@repo/types";
import type { AuthRequest } from "../utils/request-type";
import { createRoom, getRoomById, getRoomsByUserId } from "@repo/database";

export const CreateRoom = async (req: AuthRequest, res: Response) => {
  try {
    // Validating body data
    const parseData = CreateRoomSchema.safeParse(req.body);

    if (!parseData.success) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: "Invalid RoomName",
      });
      return;
    }

    // Checking if room exists
    const { roomName } = parseData.data;

    const isRoomExist = await getRoomById(roomName);
    if (isRoomExist) {
      res.status(HttpStatus.CONFLICT).json({
        success: false,
        error: "Room already exists",
      });
      return;
    }

    // Creating room
    const userId = req.auth?.id;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "User authentication failed.",
      });
      return;
    }

    const room = await createRoom(roomName, userId);

    if (!room) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to create the room. Please try again later.",
      });
      return;
    }
    res.status(HttpStatus.SUCCESS).json({
      success: true,
      message: "Room Created",
      roomName: room.slug,
    });
    return;
  } catch {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Something went wrong while creating the room.",
    });
    return;
  }
};

// Joining a room
export const joinRoom = async (req: Request, res: Response) => {
  try {
    res.status(HttpStatus.SUCCESS).json({
      success: true,
      message: "Room joined successfully.",
    });
    return;
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to join the room.",
    });
    return;
  }
};

// Leaving a room
export const leaveRoom = async (req: Request, res: Response) => {
  try {
    res.status(HttpStatus.SUCCESS).json({
      success: true,
      message: "Room left successfully.",
    });
    return;
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to leave the room.",
    });
    return;
  }
};

// Fetching all rooms
export const Rooms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.id;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "User authentication failed.",
      });
      return;
    }

    const rooms = await getRoomsByUserId(userId);
    if (!rooms || rooms.length === 0) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        error: "No rooms found for this user.",
      });
      return;
    }

    res.status(HttpStatus.SUCCESS).json({
      success: true,
      message: "Rooms fetched successfully.",
      rooms,
    });
    return;
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to retrieve rooms.",
    });
    return;
  }
};
