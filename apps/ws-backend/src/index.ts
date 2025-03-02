// TODO: Handle auth (see chess repo), use redis queue add pubsub and sticky connection logic see if can be made singleton. Complete F.E. And add close logic

import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { createClient } from "redis";

const client = createClient();
const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map<string, Map<WebSocket, string>>();

wss.on("connection", (ws, request) => {
  console.log("hello");
  // const url = request.url || "";
  // console.log(url);
  // const token = new URLSearchParams(url.split("?")[1]).get("token") || "";
  // console.log(token);
  // const decodedToken = jwt.verify(token, "5643aschvbSX");
  // if (typeof decodedToken == "string" || !decodedToken.id || !decodedToken) {
  //   ws.close();
  //   return;
  // }
  const decodedToken = { id: "2" };
  ws.on("message", async (data) => {
    try {
      const { type, payload } = JSON.parse(data.toString());

      const lPushMessage = async (message: any) => {
        await client.lPush(
          "messages",
          JSON.stringify({
            message: JSON.stringify(message),
            roomId: Number(payload.roomId),
            userId: Number(decodedToken.id),
          })
        );
        console.log("message pushed");
      };
      const lPushRemove = async (message: any) => {
        await client.lPush(
          "remove",
          JSON.stringify({
            message: message,
            // roomId: Number(payload.roomId),
            // userId: Number(decodedToken.id),
          })
        );
        console.log("deletedMessages pushed");
      };

      if (type == "SUBSCRIBE") {
        if (!rooms.has(payload.roomId)) {
          rooms.set(payload.roomId, new Map());
        }
        const room = rooms.get(payload.roomId);
        if (!room) return;
        room.set(ws, decodedToken.id);
      } else if (type === "UNSUBSCRIBE") {
        const room = rooms.get(payload.roomId);
        if (!room) return;
        room.delete(ws);
        if (room.size == 0) rooms.delete(payload.roomId);
      } else if (type == "CHAT") {
        await lPushMessage(payload.message);
      } else if (type == "ERASE") {
        await lPushRemove(payload.message);
      } else if (type == "CHANGE_ELEMENT") {
        await lPushMessage(payload.message.newElement);
        await lPushRemove(payload.message.deleteElement);
      } else if (type == "UPDATE_ELEMENT") {
      } else if (type == "TEMP_CHAT") {
      }

      const room = rooms.get(payload.roomId);
      if (!room) return;
      if (room.has(ws) || type === "UNSUBSCRIBE") {
        room.forEach((_, socket) => {
          if (socket != ws) {
            socket.send(
              JSON.stringify({
                type,
                payload: {
                  senderId: decodedToken.id,
                  roomId: payload.roomId,
                  message: payload?.message || "",
                },
              })
            );
          }
        });
      }
    } catch (error) {
      console.log("lPush Error: ", error);
    }
  });
  // ws.on("close", () => {
  //   // TODO: Add close ws logic
  // });
});

client.on("error", (err) => {
  console.log("Redis error: ", err);
});

(() => {
  try {
    client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
})();
