export type SignInFormData = {
   email: string;
   password: string;
};

export type SignUpFormData = {
   email: string;
   password: string;
   confirmPassword: string;
   firstName: string;
   lastName: string;
   phoneNumber: string;
};

export type CurrentUser = {
   _id: string;
   email: string;
   firstName: string;
   lastName: string;
};

export type BookingFormData = {
   firstName: string;
   lastName: string;
   email: string;
   adultCount: number;
   childCount: number;
   checkIn: string;
   checkOut: string;
   hotelId: string;
   paymentIntentId: string;
   totalCost: number;
};

export type SearchParams = {
   destination: string;
   checkIn: string;
   checkOut: string;
   adultCount?: number;
   childCount?: number;
   page?: string;
   facilities?: string[];
   types?: string[];
   stars?: string | string[];
   maxPrice?: string;
   sortOption?: string;
};

export interface ChatMessage {
   _id: string;
   chatRoomId: string;
   sender: CurrentUser | string;
   content: string;
   timestamp: Date;
   status?: "sent" | "delivered" | "read";
}

export interface ChatRoom {
   _id: string;
   participants: CurrentUser[];
   lastMessage?: ChatMessage;
   createdAt: Date;
   updatedAt: Date;
}

export interface WSMessage {
   type: string;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   payload: any;
}
