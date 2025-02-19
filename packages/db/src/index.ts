import { PrismaClient } from "@prisma/client";

// TODO: add singleton

const prisma = new PrismaClient();

export const User = prisma.user;
export const Room = prisma.room;
export const Chat = prisma.chat;
