import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { Request, Response } from "express";
import {
   createChatRoom,
   getChatRoomsByUserId,
   getChatRoomMessages,
} from "../services/chat.services";

const router = Router();

router.use(verifyToken);

// Get all chat rooms for the authenticated user
router.get("/rooms", async (req: Request, res: Response): Promise<any> => {
   try {
      const userId = req.userId;
      const rooms = await getChatRoomsByUserId(userId);

      res.json(rooms);
   } catch (err) {
      console.error("Error fetching chat rooms:", err);
      res.status(500).json({ message: "Failed to fetch chat rooms" });
   }
});

// Create a new chat room or get existing one
router.post("/rooms", async (req: Request, res: Response): Promise<any> => {
   try {
      const { userId } = req.body;
      const currentUserId = req.userId;

      if (!userId) {
         return res.status(400).json({ message: "User ID is required" });
      }

      const room = await createChatRoom(currentUserId, userId);

      res.status(201).json(room);
   } catch (err) {
      console.error("Error creating chat room:", err);
      res.status(500).json({ message: "Failed to create chat room" });
   }
});

// Get messages for a specific chat room
router.get(
   "/rooms/:roomId/messages",
   async (req: Request, res: Response): Promise<any> => {
      try {
         const { roomId } = req.params;
         const limit = parseInt(req.query.limit as string) || 50;
         const offset = parseInt(req.query.offset as string) || 0;

         const messages = await getChatRoomMessages(roomId, limit, offset);

         res.json(messages);
      } catch (err) {
         console.error("Error fetching messages:", err);
         res.status(500).json({ message: "Failed to fetch messages" });
      }
   }
);

export default router;
