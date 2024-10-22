import { useQuery } from "@tanstack/react-query";
import { getApi } from "../api/Api";
import { milliseconds } from "date-fns";

export const useGetUser = (id?: number) => {
  const api = getApi();

  return useQuery({
    queryFn: () => {
      if (id === undefined) {
        throw new Error("We can't fetch without an email set...");
      }

      return api.users.getUser(id);
    },

    queryKey: ["user", id],
    staleTime: milliseconds({ minutes: 1 }),
  });
};
