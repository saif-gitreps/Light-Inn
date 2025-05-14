import { useQuery } from "react-query";
import API_BASE_URL from "../../../config/base-url";
import { UserType } from "../../../../../backend/src/shared/types";

const searchUsers = async (name: string): Promise<UserType[]> => {
   const queryParam = new URLSearchParams();
   queryParam.append("name", name);

   const response = await fetch(
      `${API_BASE_URL}/api/users/search?${queryParam.toString()}`,
      {
         credentials: "include",
      }
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
