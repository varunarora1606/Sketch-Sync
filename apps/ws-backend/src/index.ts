import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
  const url = request.url || "";
  const token = new URLSearchParams(url.split("?")[1]).get("wsToken") || "";
  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET as string || "ghvgvhg"
  );
  if (typeof decodedToken == "string" || !decodedToken.UserId || !decodedToken.roomId) {
    ws.close();
    return;
  }
  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
