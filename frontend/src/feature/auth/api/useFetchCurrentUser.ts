import { useQuery, UseQueryOptions } from "react-query";
import API_BASE_URL from "../../../config/base-url";
import { CurrentUser } from "../../../lib/shared-types";

export const fetchCurrentUser = async (): Promise<CurrentUser> => {
   const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: "include",
   });

   if (!response.ok) {
      throw new Error("Error fetching user");
   }

   return response.json();
};

export const useFetchCurrentUser = (options?: UseQueryOptions<CurrentUser, Error>) => {
   return useQuery<CurrentUser, Error>("currentUser", fetchCurrentUser, options);
};
