import { Recipe } from "../../types/Recipe";
import { getHost } from "../util";

export class RecipesApi {
  async getRecipes(): Promise<Recipe[]> {
    try {
      const response = await fetch(`${getHost()}/recipes`);
      return await response.json();
    } catch (error) {
      throw new Error("");
    }
  }

  async getRecipe(id: number): Promise<Recipe> {
    try {
      const response = await fetch(`${getHost()}/recipes/${id}`);
      if (!response.ok) {
        throw new Error("Not 2xx response", { cause: response });
      }
      return await response.json();
    } catch (error) {
      throw new Error("");
    }
  }

  async postRecipe(recipe: Recipe): Promise<Recipe> {
    const response = await fetch(`${getHost()}/recipes`, {
      method: "POST",
      body: JSON.stringify({
        Title: recipe.title,
        Description: recipe.description,
        Username: recipe.username,
        MethodSteps: recipe.methodSteps,
        Ingredients: recipe.ingredients,
        ImageUrl: recipe.imageUrl,
        User: recipe.user,
      }),
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  async updateRecipe(recipe: Recipe): Promise<Recipe> {
    const response = await fetch(`${getHost()}/recipes/${recipe.id}`, {
      method: "PUT",
      body: JSON.stringify(recipe),
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  async deleteRecipe(id: number): Promise<void> {
    try {
      const response = await fetch(`${getHost()}/recipes/${id}`, {
        method: "DELETE",
      });

      return;
    } catch (error) {
      throw new Error("Oh no! ");
    }
  }

  async searchRecipes(
    searchValue: string,
    filter: string[]
  ): Promise<Recipe[]> {
    try {
      const response = await fetch(`${getHost()}/recipes/search/`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchValue: searchValue,
          userEmails: filter,
        }),
      });

      return response.json();
    } catch (error) {
      throw new Error("Error searching recipes" + error);
    }
  }

  async getArchivedRecipes(): Promise<Recipe[]> {
    try {
      const response = await fetch(`${getHost()}/recipes/archive`);

      return response.json();
    } catch (error) {
      throw new Error("Error fetching archived recipes");
    }
  }

  async archiveRecipe(recipe: Recipe) {
    try {
      const response = await fetch(`${getHost()}/recipes/${recipe.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...recipe, isArchived: true }),
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });

      return response.json();
    } catch (error) {
      throw new Error("Error archiving recipe");
    }
  }

  async unArchiveRecipe(recipe: Recipe) {
    try {
      const response = await fetch(`${getHost()}/recipes/${recipe.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...recipe, isArchived: false }),
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });

      return response.json();
    } catch (error) {
      throw new Error("Error archiving recipe");
    }
  }
}
