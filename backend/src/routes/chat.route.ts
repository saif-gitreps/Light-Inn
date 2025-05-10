import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import ChatRoom from "../models/chatRoom.model";
import Message from "../models/chatMessage.model";

const router = express.Router();

// Get all chat rooms for the current user
router.get("/rooms", verifyToken, async (req, res) => {
   try {
      const userId = req.userId;

      const rooms = await ChatRoom.find({ participants: userId })
         .populate("participants", "name avatar")
         .populate({
            path: "lastMessage",
            select: "content timestamp read sender",
         })
         .sort({ lastActivity: -1 });

      res.status(200).json(rooms);
   } catch (error) {
      console.error("Error fetching chat rooms:", error);
      res.status(500).json({ message: "Failed to fetch chat rooms" });
   }
});

// Get messages for a specific chat room
router.get("/messages/:roomId", verifyToken, async (req, res): Promise<any> => {
   try {
      const { roomId } = req.params;
      const userId = req.userId;

      // Verify the room exists and user is a participant
      const room = await ChatRoom.findById(roomId);
      if (!room) {
         return res.status(404).json({ message: "Chat room not found" });
      }

      const isParticipant = room.participants.some(
         (participant) => participant.toString() === userId
      );
      if (!isParticipant) {
         return res.status(403).json({ message: "Unauthorized access to this chat" });
      }

      // Get the other participant
      const otherUserId = room.participants.find(
         (participant) => participant.toString() !== userId
      );

      // Get messages between these users
      const messages = await Message.find({
         $or: [
            { sender: userId, receiver: otherUserId },
            { sender: otherUserId, receiver: userId },
         ],
      })
         .populate("sender", "name avatar")
         .populate("receiver", "name avatar")
         .sort({ timestamp: 1 });

      res.status(200).json(messages);
   } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
   }
});

// Get messages with a specific user (without roomId)
router.get("/messages/user/:userId", verifyToken, async (req, res) => {
   try {
      const currentUserId = req.userId;
      const otherUserId = req.params.userId;

      // Find or create chat room
      let room = await ChatRoom.findOne({
         participants: { $all: [currentUserId, otherUserId] },
      });

      if (!room) {
         // Create new room if first time chatting
         room = await ChatRoom.create({
            participants: [currentUserId, otherUserId],
            lastActivity: new Date(),
         });
      }

      // Get messages between these users
      const messages = await Message.find({
         $or: [
            { sender: currentUserId, receiver: otherUserId },
            { sender: otherUserId, receiver: currentUserId },
         ],
      })
         .populate("sender", "name avatar")
         .populate("receiver", "name avatar")
         .sort({ timestamp: 1 });

      res.status(200).json({
         roomId: room._id,
         messages,
      });
   } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
   }
});

// Mark messages as read
router.put("/messages/read", verifyToken, async (req, res) => {
   try {
      const { messageIds } = req.body;
      const userId = req.userId;

      // Ensure user can only mark messages sent to them
      const result = await Message.updateMany(
         { _id: { $in: messageIds }, receiver: userId },
         { $set: { read: true } }
      );

      res.status(200).json({ success: true, count: result.modifiedCount });
   } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: "Failed to mark messages as read" });
   }
});

export default router;
