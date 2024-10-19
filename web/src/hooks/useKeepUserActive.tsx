import { useMutation, useQueryClient } from "@tanstack/react-query";
import { minutesToMilliseconds } from "date-fns";
import { useCallback, useEffect } from "react";
import { getApi } from "../api/Api";
import { User } from "./useUser";

export const useKeepUserActive = (user: User | null) => {
  const queryClient = useQueryClient();
  const api = getApi();

  const mutationFn = useCallback(() => {
    if (user === null) {
      throw new Error("Can't log in user that doesn't have username or email");
    }

    return api.users.postUser({ email: user.email });
  }, [api, user]);

  const { mutate } = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    mutationKey: ["user", "post", user?.userName],
  });

  const mutateRepeated = useCallback(() => {
    // Hit the API first time
    mutate();

    setTimeout(() => {
      // Hit the mutate API
      mutate();

      // Restart
      mutateRepeated();
    }, minutesToMilliseconds(1));
  }, [mutate]);

  // Only run this the first time they load
  useEffect(() => {
    if (user !== null) {
      mutateRepeated();
    }
  }, []);
};
