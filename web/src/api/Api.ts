import { Recipe } from "../types/Recipe";

export class Api {
  getHost(): string {
    if (process.env.NODE_ENV === "production") {
      return `${window.location.host}/api`;
    } else {
      return "localhost:8000";
    }
  }
  async getRecipes(): Promise<Recipe[]> {
    const response = await fetch(`http://${this.getHost()}/recipe`);
    return await response.json();
  }

  async postRecipe(recipe: Recipe): Promise<Recipe> {
    const response = await fetch(`http://${this.getHost()}/recipe`, {
      method: "POST",
      body: JSON.stringify({
        Title: recipe.title,
        Description: recipe.description,
        Username: recipe.username,
        MethodSteps: recipe.methodStepsList,
        Ingredients: recipe.ingredients,
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
        `http://${this.getHost()}/recipe/${recipe.id}`,
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
