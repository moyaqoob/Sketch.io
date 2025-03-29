import type { Response } from "express";
import { HttpStatus } from "../utils/HttpStatus";
import type { AuthRequest } from "../utils/request-type";
import { getRoomCanvas } from "@repo/database";

// //  Clear the canvas by deleting all designs for a specific room
// export const clearCanvas = async (req: AuthRequest, res: Response) => {
//   const userId = req.auth?.id;
//   if (!userId) {
//     res
//       .status(HttpStatus.UNAUTHORIZED)
//       .json({ success: false, error: "Unauthorized" });
//     return;
//   }

//   const { roomId } = req.params;
//   if (!roomId) {
//     res
//       .status(HttpStatus.BAD_REQUEST)
//       .json({ success: false, message: "Room ID required" });
//     return;
//   }
// };

//  Fetch all designs for a specific room
export const getCanvasDesigns = async (req: AuthRequest, res: Response) => {
  const userId = req.auth?.id;
  if (!userId) {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ success: false, error: "Unauthorized" });
    return;
  }

  const { roomId } = req.params;
  if (!roomId) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ success: false, message: "Room ID required" });
    return;
  }

  try {
    const designs = await getRoomCanvas(roomId);

    res.json({ success: true, designs });
  } catch (error) {
    if (error)
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: "Failed to fetch canvas designs" });
  }
};
