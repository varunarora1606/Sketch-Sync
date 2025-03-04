import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Room } from "@repo/db/client";
import { ApiResponse } from "../utils/ApiResponse";

const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.create({ data: { userId: req.user.id } });

  if (!room) throw new ApiError(401, "Room not created");

  res.status(200).json(new ApiResponse(200, room, "room created successfully"));
});

const changeRoomName = asyncHandler(async (req: Request, res: Response) => {
  const { name, roomId } = req.body;
  console.log(name);
  if (!name || !roomId)
    throw new ApiError(400, "Room name and slug cannot be empty");

  const room = await Room.update({
    where: { id: roomId },
    data: { name: name, lastEdited: new Date() },
  });
  console.log(room);

  if (!room) throw new ApiError(401, "Wrong slug provided");

  res
    .status(200)
    .json(new ApiResponse(200, room, "Room name updated successfully"));
});

const getRooms = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const room = await Room.findMany({
    where: { userId: user.id },
    orderBy: {
      lastEdited: "desc",
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, room, "rooms fetched successfully"));
});

const getRoomById = asyncHandler(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const room = await Room.findFirst({ where: { id: roomId } });
  if (!room) throw new ApiError(401, "No such room found");
  res.status(200).json(new ApiResponse(200, room, "room fetched successfully"));
});

const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) throw new ApiError(400, "id missing");
  const room = await Room.delete({ where: { id, userId: req.user.id } });
  if (!room) throw new ApiError(401, "Room not found");

  res.status(200).json(new ApiResponse(200, room, "Room deleted successfully"));
});

export { createRoom, changeRoomName, getRooms, deleteRoom, getRoomById };
