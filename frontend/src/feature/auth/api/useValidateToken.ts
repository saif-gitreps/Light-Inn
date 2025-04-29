import { useQuery } from "react-query";
import API_BASE_URL from "../../../config/base-url";

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

export const useValidateToken = () => {
   return useQuery("token", validateToken);
};
