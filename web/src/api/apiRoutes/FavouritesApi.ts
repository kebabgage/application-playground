import { Recipe } from "../../types/Recipe";
import { getHost } from "../util";
import { User } from "../../types/User";

export class FavouritesApi {
  async addToFavourites(recipeId?: number, userId?: number) {
    try {
      const response = await fetch(`${getHost()}/favourites/`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          recipeId: recipeId,
        }),
      });

      return response.json();
    } catch (error) {
      throw new Error("Error in favouriting");
    }
  }

  async removeFromFavourites(favouriteId: number) {
    console.log("Trying to delete", favouriteId);
    try {
      await fetch(`${getHost()}/favourites/${favouriteId}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw new Error("Error when deleting favourite");
    }
  }

  async getFavouriteByUserAndRecipe(
    user: User,
    recipe: Recipe
  ): Promise<{ id: number; recipe: null; user: null }> {
    try {
      const response = await fetch(
        `${getHost()}/favourites/userId=${user.id}&recipeId=${recipe.id}`
      );

      return response.json();
    } catch (error) {
      throw new Error("Error in getting favourite");
    }
  }

  async getFavourites(
    userId: number
  ): Promise<
    { id: number; user: User; recipe: Recipe; dateFavourited: Date }[]
  > {
    try {
      const response = await fetch(`${getHost()}/favourites/${userId}`);
      return response.json();
    } catch (error) {
      throw new Error("Error fetching favourites for user");
    }
  }
}
