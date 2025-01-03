import { UserType } from "../../../backend/src/shared/types";
import { SignInFormData } from "../pages/SignIn";
import { SignUpFormData } from "../pages/SignUp";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const fetchCurrentUser = async (): Promise<UserType> => {
   const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error fetching user");
   }

   return response.json();
};

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
