import mongoose from "mongoose";

export type HotelType = {
   _id: string;
   userId: string;
   name: string;
   city: string;
   country: string;
   description: string;
   type: string;
   adultCount: number;
   childCount: number;
   facilities: string[];
   pricePerNight: number;
   rating: number;
   imageUrls: string[];
   lastUpdated: Date;
   bookings: BookingType[];
};

export type BookingType = {
   _id: string;
   userId: string;
   firstName: string;
   lastName: string;
   email: string;
   adultCount: number;
   childCount: number;
   checkIn: Date;
   checkOut: Date;
   totalCost: number;
};

export type HotelSearchResponse = {
   data: HotelType[];
   pagination: {
      total: number;
      page: number;
      pages: number;
   };
};

export type UserType = {
   _id: string;
   email: string;
   password: string;
   firstName: string;
   lastName: string;
};

export type PaymentIntentResponse = {
   paymentIntentId: string;
   clientSecret: string;
   totalCost: number;
};

export interface ChatMessage {
   _id: string;
   chatRoomId: string;
   sender: string;
   content: string;
   timestamp: Date;
}

export interface ChatRoom {
   _id: string;
   participants: string[];
   lastMessage?: ChatMessage;
   createdAt: Date;
   updatedAt: Date;
}

export interface WSMessage {
   type: "message" | "join_room" | "leave_room" | "typing" | "read";
   payload: any;
}
