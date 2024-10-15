import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { getApi } from "../api/Api";
import { User } from "./useUser";
import { minutesToMilliseconds, minutesToSeconds } from "date-fns";

export const useKeepUserActive = (user: User | null) => {
  const queryClient = useQueryClient();
  const api = getApi();

  const mutationFn = useCallback(() => {
    if (user === null) {
      throw new Error("Can't log in user that doesn't have username or email");
    }

    return api.postUser({ email: user.email });
  }, [api, user]);

  const { mutate } = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    mutationKey: ["post", "user"],
  });

  // Only run this the first time they load
  useEffect(() => {
    if (user !== null) {
      // // Post the user once
      mutate();
      // Then repeat every minute
      setTimeout(() => {
        mutate();
      }, minutesToMilliseconds(1));
    }
  }, [user, mutate]);
};
