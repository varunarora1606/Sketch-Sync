import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Chat } from "@repo/db/client";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const getAllChats = asyncHandler(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  if (!roomId) throw new ApiError(400, "RoomId missing");
  const chats = await Chat.findMany({
    where: { roomId },
    select: { message: true },
  });

  res.status(200).json(new ApiResponse(200, chats, "Fetched all room chats"));
});

export { getAllChats };
