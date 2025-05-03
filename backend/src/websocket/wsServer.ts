import { Server as HttpServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import url, { URL } from "url";

// map to store active connections
const clients = new Map<string, WebSocket>();

// map to store which chat room a user is connected to
const userRooms = new Map<string, Set<string>>();

export default function setUpWebSocketServer(server: HttpServer) {
   const wss = new WebSocketServer({ noServer: true });

   // handle the upgrade from HTTP to WebSocket
   server.on("upgrade", async (request, socket, head) => {
      const reqUrl = new URL(request.url || "");
      const pathname = reqUrl.pathname;

      if (pathname === "/ws") {
      }
   });
}
