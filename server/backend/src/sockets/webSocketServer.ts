import { config } from "dotenv";
import { Server } from "ws";
import { PrismaClient } from "@prisma/client";

config();
const port = process.env.WEBSOCKET_PORT || 8080;
const prisma = new PrismaClient();

const server = new Server({ port });

server.on("connection", (ws) => {
  console.log("Client connected");

  const intervalId = setInterval(async () => {
    try {
      let socketData;
      const modes = await prisma.mode.findMany();

      if (modes[0].name === "data") {
        const data = await prisma.data.findMany();
        socketData = { datas: data, mode: modes[0].name };
      } else if (modes[0].name === "playlist") {
        const playlist = await prisma.playlist.findUnique({
          where: { id: modes[0].playlist_id },
          include: { medias: true },
        });
        if (playlist) {
          socketData = { playlist: playlist, mode: modes[0].name };
        }
      }

      ws.send(JSON.stringify(socketData));
    } catch (error) {
      console.error("Error fetching modes:", error);
      ws.send("Error fetching modes\n");
    }
  }, 1000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(intervalId);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
    clearInterval(intervalId);
  });
});

console.log(`WebSocket Server is running on port ${port}`);
