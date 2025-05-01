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
