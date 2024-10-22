import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavourited } from "../../hooks/useFavourited";
import { getApi } from "../../api/Api";
import { Recipe } from "../../types/Recipe";
import { useCurrentUser, User } from "../../hooks/useCurrentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Favorite } from "@mui/icons-material";
import { useGetUser } from "../../hooks/useGetUser";

const getQueryKey = () => {};

interface AddToFavouritesButtonProps {
  user: User;
  recipe: Recipe;
}

export const AddToFavouritesButton = ({
  user: userfake,
  recipe,
}: AddToFavouritesButtonProps) => {
  const queryClient = useQueryClient();

  const [currentUser] = useCurrentUser();
  const { data: user } = useGetUser(currentUser?.id);

  const { favourited, favouriteId } = useFavourited(recipe, user);
  const api = getApi();

  const { mutate: addFavouriteMutation } = useMutation({
    mutationFn: () => {
      return api.favourites.addToFavourites(recipe.id, user?.id);
    },
    onSuccess: () => {
      console.log("successfully favourited");
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
    onError: (error) => {
      console.log(error);
    },
    mutationKey: ["favourites", "post", `user=${user?.id}&recipe=${recipe.id}`],
  });

  const { mutate: removeFavouriteMutation } = useMutation({
    mutationFn: () => {
      if (favouriteId === undefined) {
        throw new Error("Can't delete favourite without id");
      }

      console.log("removing");

      return api.favourites.removeFromFavourites(favouriteId);
    },
    onSuccess: () => {
      console.log("successfully unfavourited");
      queryClient.invalidateQueries({
        queryKey: ["favourites"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onClick = () => {
    console.log("fav", favourited);
    if (favourited) {
      // Delete
      removeFavouriteMutation();
    } else {
      // Add to favourites
      // api.favourites.addToFavourites(recipe?.id, user?.id);
      addFavouriteMutation();
    }
  };
  return (
    <IconButton
      aria-label="add an alarm"
      onClick={onClick}
      color={favourited === true ? "error" : "default"}
    >
      {favourited ? <Favorite /> : <FavoriteBorderIcon />}
    </IconButton>
  );
};
