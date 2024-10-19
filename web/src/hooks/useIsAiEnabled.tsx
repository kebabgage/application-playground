import { useQuery } from "@tanstack/react-query";
import { getApi } from "../api/Api";

export const useIsAiEnabled = () => {
  const api = getApi();

  const queryFn = () => {
    return api.ai.isAiEnabled();
  };

  return useQuery({
    queryFn,
    queryKey: ["ai", "enabled"],
    staleTime: Infinity,
    refetchInterval: Infinity,
  });
};
