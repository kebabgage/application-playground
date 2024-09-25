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
        Title: "This is my title",
        Description: "This is my description",
      }),
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }
}

export const getApi = () => {
  return new Api();
};
