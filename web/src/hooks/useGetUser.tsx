import { useQuery } from "@tanstack/react-query";
import { getApi } from "../api/Api";

export const useGetUser = (email?: string) => {
  const api = getApi();

  return useQuery({
    queryFn: () => {
      if (email === undefined) {
        throw new Error("We can't fetch without an email set...");
      }

      return api.users.getUser(email);
    },

    queryKey: ["user", `email=${email}}`],
  });
};
