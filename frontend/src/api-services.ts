import { SignInFormData } from "./pages/SignIn";
import { SignUpFormData } from "./pages/SignUp";
import { HotelType } from "../../backend/src/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const signUp = async (formData: SignUpFormData) => {
   const response = await fetch(`${API_BASE_URL}/api/users/sign-up`, {
      method: "POST",
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
   });

   const responseBody = await response.json();

   if (!response.ok) {
      throw new Error(responseBody.message);
   }
};

export const signIn = async (formData: SignInFormData) => {
   const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: "POST",
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
   });

   const responseBody = await response.json();

   if (!response.ok) {
      throw new Error(responseBody.message);
   }

   return responseBody;
};

export const validateToken = async () => {
   const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      method: "GET",
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("unauthorized");
   }

   return response.json();
};

export const signOut = async () => {
   const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Failed to sign out");
   }
};

export const addHotel = async (formData: FormData) => {
   const response = await fetch(`${API_BASE_URL}/api/user-hotels`, {
      method: "POST",
      credentials: "include",
      body: formData,
   });

   if (!response.ok) {
      throw new Error("Failed to add hotel");
   }

   return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
   const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      method: "GET",
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Failed to fetch hotels");
   }

   return response.json();
};

export const fetchMyHotelById = async (id: string): Promise<HotelType> => {
   const response = await fetch(`${API_BASE_URL}/api/my-hotels/${id}`, {
      method: "GET",
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Failed to fetch hotel");
   }

   return response.json();
};

export const updatedMyHotel = async (formData: FormData) => {
   const response = await fetch(`${API_BASE_URL}/api/my-hotels/${formData.get("id")}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
   });

   if (!response.ok) {
      throw new Error("Failed to update hotel");
   }

   return response.json();
};
