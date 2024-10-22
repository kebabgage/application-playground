import { useQueries, useQuery } from "@tanstack/react-query";
import { getApi } from "../api/Api";
import { Recipe } from "../types/Recipe";
import { User } from "./useCurrentUser";

export const useFavourited = (
  recipe: Recipe,
  user?: User
): { favourited: boolean; favouriteId?: number } => {
  const api = getApi();

  const queryFn = () => {
    console.log("querying fav");
    if (user === undefined) {
      throw new Error("Can't fetch is user is undefined");
    }

    return api.favourites.getFavouriteByUserAndRecipe(user, recipe);
  };

  const { data, isFetching, isError } = useQuery({
    queryFn,
    queryKey: ["favourites", `user=${user?.id}`, `recipe=${recipe.id}`],
    retry: false,
  });

  console.log(data);

  if (data === undefined || isError === true) {
    return { favourited: false };
  }

  return { favourited: true, favouriteId: data.id };
  // return false;
};
