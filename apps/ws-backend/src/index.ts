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
  const decodedToken = jwt.verify(
    token,
    "5643aschvbSX"
  );
  if (
    typeof decodedToken == "string" ||
    !decodedToken.id ||
    !decodedToken
  ) {
    ws.close();
    return;
  }
  ws.on("message", (data) => {
    if(typeof data !== "string") return
    const { type, payload } = JSON.parse(data);
    switch (type) {
      case "SUBSCRIBE":
        if (!rooms.get(payload.roomId)) {
          rooms.set(payload.roomId, new Map());
        }
        rooms.get(payload.roomId)?.set(ws, decodedToken.UserId);
        ws.send("Subscribed room successfully")
        break;

      case "UNSUBSCRIBE":
        const room = rooms.get(payload.roomId);
        if (!room) break;
        room.delete(ws);
        if (room.size == 0) rooms.delete(payload.roomId);
        ws.send("Unsubscribed room successfully")
        break;

      case "chat":
        const users = rooms.get(payload.roomId);
        console.log("chat")
        if (users?.has(ws)) {
          console.log("chat")
          users.forEach((_, socket) => {
            socket.send(
              JSON.stringify({
                senderId: decodedToken.id,
                roomId: payload.roomId,
                message: payload.message,
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
