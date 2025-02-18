import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Room } from "@repo/db/client";
import { ApiResponse } from "../utils/ApiResponse";

const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const { roomName } = req.body;
  if (!roomName) throw new ApiError(400, "Room name not provided");

  const slug = `${req.user.id}_${roomName}`;
  const room = await Room.create({ data: { slug: slug, userId: req.user.id } });

  res.status(200).json(new ApiResponse(200, room, "room created successfully"));
});

export { createRoom };
