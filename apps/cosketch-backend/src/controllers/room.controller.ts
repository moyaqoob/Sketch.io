import type { Request, Response } from "express";
import { HttpStatus } from "../utils/HttpStatus";
import { CreateRoomSchema } from "@repo/types";
import type { AuthRequest } from "../utils/request-type";
import { createRoom, getRoomById, getRoomsByUserId } from "@repo/database";

export const CreateRoom = async (req: AuthRequest, res: Response) => {
  try {
    // Validate request body
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: "Invalid Room Name",
      });
      return;
    }

    const { roomName } = parsedData.data;

    // Ensure user is authenticated
    const userId = req.auth?.id;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "User authentication failed.",
      });
      return;
    }

    // Check if room already exists
    const existingRoom = await getRoomById(roomName);
    if (existingRoom) {
      res.status(HttpStatus.CONFLICT).json({
        success: false,
        error: "Room already exists",
      });
      return;
    }

    // Create the room
    const room = await createRoom(roomName, userId);
    if (!room) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to create the room. Please try again later.",
      });
      return;
    }

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Room Created Successfully",
      roomId: room.id,
      slug: room.slug,
    });
    return;
  } catch (error) {
    console.error("Error creating room:", error);
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

export const getRooms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.id;

    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "User authentication failed.",
      });
      return;
    }

    const user = await getRoomsByUserId(userId);
    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        error: "User not found.",
      });
      return;
    }

    if (!user.rooms?.length) {
      res.status(HttpStatus.SUCCESS).json({
        success: true,
        message: "No rooms available.",
        data: {
          userName: user.name,
          rooms: [],
        },
      });
      return;
    }

    const formattedRooms = user.rooms.map((room) => ({
      roomId: room.id,
      slug: room.slug,
      createdAt: room.createdAt, // Sending raw timestamp
      participants: room.users.map((participant) => participant.name), // Correct relation key
      noOfParticipants: room.users.length, // Correct relation key
    }));

    res.status(HttpStatus.SUCCESS).json({
      success: true,
      message: "Rooms fetched successfully.",
      data: {
        userName: user.name,
        rooms: formattedRooms,
      },
    });
    return;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Internal server error.",
    });
    return;
  }
};
