import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map<string, Map<WebSocket, string>>();

// TODO: Add message to database using queue and scale using pub sub

wss.on("connection", (ws, request) => {
  // const url = request.url || "";
  // console.log(url);
  // const token = new URLSearchParams(url.split("?")[1]).get("token") || "";
  // console.log(token);
  // const decodedToken = jwt.verify(token, "5643aschvbSX");
  // if (typeof decodedToken == "string" || !decodedToken.id || !decodedToken) {
  //   ws.close();
  //   return;
  // }
  const decodedToken = { id: "Varun" };
  ws.on("message", (data) => {
    const { type, payload } = JSON.parse(data.toString());
    const room = rooms.get(payload.roomId);
    switch (type) {
      case "SUBSCRIBE":
        if (!room) {
          rooms.set(payload.roomId, new Map());
        }
        rooms.get(payload.roomId)?.set(ws, decodedToken.id);
        rooms.get(payload.roomId)?.forEach((_, socket) => {
          if (socket != ws) {
            socket.send(
              JSON.stringify({
                type: "SUBSCRIBE",
                payload: {
                  senderId: decodedToken.id,
                  roomId: payload.roomId,
                },
              })
            );
          }
        });
        break;

      case "UNSUBSCRIBE":
        if (!room) break;
        room.delete(ws);
        if (room.size == 0) rooms.delete(payload.roomId);
        room.forEach((_, socket) => {
          if (socket != ws) {
            socket.send(
              JSON.stringify({
                type: "UNSUBSCRIBE",
                payload: {
                  senderId: decodedToken.id,
                  roomId: payload.roomId,
                },
              })
            );
          }
        });
        break;

      case "TEMP_CHAT":
      case "UPDATE_ELEMENT":
      case "ERASE":
      case "CHAT":
        if (room?.has(ws)) {
          room.forEach((_, socket) => {
            if (socket != ws) {
              socket.send(
                JSON.stringify({
                  type,
                  payload: {
                    senderId: decodedToken.id,
                    roomId: payload.roomId,
                    message: payload.message,
                  },
                })
              );
            }
          });
        }
        break;

      default:
        break;
    }
  });
  ws.on('close', () => {
    // TODO: Add close ws logic
  })
});
