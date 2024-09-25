import { Recipe } from "../types/Recipe";

export class Api {
  async getRecipes(): Promise<Recipe[]> {
    const response = await fetch("http://localhost:8000/recipe");
    return await response.json();
  }

  async postRecipe(recipe: Recipe): Promise<Recipe> {
    const response = await fetch("http://localhost:8000/recipe", {
      method: "POST",
      body: JSON.stringify({
        Title: recipe.title,
        Description: recipe.description,
      }),
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  async deleteRecipe(recipe: Recipe): Promise<void> {
    try {
      const response = await fetch(
        `http://localhost:8000/recipe/${recipe.id}`,
        {
          method: "DELETE",
        }
      );

      return;
    } catch (error) {
      throw new Error("Oh no! ");
    }
  }
}

export const getApi = () => {
  return new Api();
};
