import { User } from "../hooks/useCurrentUser";
import { Recipe } from "../types/Recipe";
import { AiApi } from "./apiRoutes/AiApi";
import { FavouritesApi } from "./apiRoutes/FavouritesApi";
import { ImagesApi } from "./apiRoutes/ImagesApi";
import { RecipesApi } from "./apiRoutes/RecipesApi";
import { UsersApi } from "./apiRoutes/UsersApi";

export class Api {
  public ai: AiApi;
  public recipes: RecipesApi;
  public images: ImagesApi;
  public users: UsersApi;
  public favourites: FavouritesApi;

  constructor() {
    this.ai = new AiApi();
    this.recipes = new RecipesApi();
    this.images = new ImagesApi();
    this.users = new UsersApi();
    this.favourites = new FavouritesApi();
  }

  getHost(): string {
    if (process.env.NODE_ENV === "production") {
      return `http://${window.location.host}/api`;
    } else {
      return "http://localhost:8000";
    }
  }

  async logout() {
    try {
      const response = await fetch(`${this.getHost()}/`);
    } catch (error) {}
  }
}

export const getApi = () => {
  return new Api();
};
