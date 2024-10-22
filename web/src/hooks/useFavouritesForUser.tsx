import { getApi } from "../api/Api";

export const useFavouritesForUser = (userId: number) => {
  const api = getApi();

  const queryFn = () => {
    return api.favourites.getFavourites(userId);
  };
};
