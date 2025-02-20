import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map<string, Map<WebSocket, string>>();

// TODO: Add message to database using queue and scale using pub sub

wss.on("connection", (ws, request) => {
  const url = request.url || "";
  console.log(url);
  const token = new URLSearchParams(url.split("?")[1]).get("token") || "";
  console.log(token);
  const decodedToken = jwt.verify(token, "5643aschvbSX");
  if (typeof decodedToken == "string" || !decodedToken.id || !decodedToken) {
    ws.close();
    return;
  }
  ws.on("message", (data) => {
    const { type, payload } = JSON.parse(data.toString());
    switch (type) {
      case "SUBSCRIBE":
        if (!rooms.get(payload.roomId)) {
          rooms.set(payload.roomId, new Map());
        }
        rooms.get(payload.roomId)?.set(ws, decodedToken.UserId);
        ws.send(
          JSON.stringify({
            type: "SUBSCRIBE",
            payload: {
              senderId: decodedToken.id,
              roomId: payload.roomId,
            },
          })
        );
        break;

      case "UNSUBSCRIBE":
        const room = rooms.get(payload.roomId);
        if (!room) break;
        room.delete(ws);
        if (room.size == 0) rooms.delete(payload.roomId);
        ws.send(
          JSON.stringify({
            type: "UNSUBSCRIBE",
            payload: {
              senderId: decodedToken.id,
              roomId: payload.roomId,
            },
          })
        );
        break;

      case "CHAT":
        const users = rooms.get(payload.roomId);
        if (users?.has(ws)) {
          users.forEach((_, socket) => {
            socket.send(
              JSON.stringify({
                type: "CHAT",
                payload: {
                  senderId: decodedToken.id,
                  roomId: payload.roomId,
                  message: payload.message,
                },
              })
            );
          });
        }
        break;

      default:
        break;
    }
  });
});
