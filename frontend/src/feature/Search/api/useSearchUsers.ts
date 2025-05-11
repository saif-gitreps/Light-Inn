import { useQuery } from "react-query";
import API_BASE_URL from "../../../config/base-url";

const searchUsers = async (name: string) => {
   const queryParam = new URLSearchParams();
   queryParam.append("name", name);

   const response = await fetch(
      `${API_BASE_URL}/api/users/search?${queryParam.toString()}`
   );

   if (!response.ok) {
      throw new Error("Failed to fetch hotels");
   }

   return response.json();
};

export const useSearchUsers = (name: string) => {
   return useQuery("searchUser", {
      queryFn: () => searchUsers(name),
   });
};
