import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import jwt from "jsonwebtoken";
import { options } from "../contants";
import { User } from "@repo/db/client";

// TODO: Hash the password using Bcrypt and use Zod

const signUpUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  console.log(email)
  if (await User.findFirst({ where: { email } })) {
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({
    data: { email, password, name },
    select: { email: true, id: true, name: true },
  });
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET as string
  );
  res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, { user }, "User account created successfully"));
});

const signInUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findFirst({
    where: { email, password },
    select: { email: true, name: true, id: true },
  });
  if (!user) {
    throw new ApiError(403, "Wrong email or password");
  }
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET as string
  );
  res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, { user }, "User logged in successfully"));
});

const logOutUser = asyncHandler(async (_, res: Response) => {
  res
    .status(200)
    .clearCookie("token")
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const authCheck = asyncHandler(async (_, res: Response) => {
  res.status(200).json(new ApiResponse(200, {}, "User is already logged in"));
});

export { signUpUser, signInUser, logOutUser, authCheck };
