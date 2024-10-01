import { Recipe } from "../types/Recipe";

export class Api {
  getHost(): string {
    if (process.env.NODE_ENV === "production") {
      return `http://${window.location.host}/api`;
    } else {
      return "http://localhost:8000";
    }
  }
  async getRecipes(): Promise<Recipe[]> {
    try {
      const response = await fetch(`${this.getHost()}/recipe`);
      return await response.json();
    } catch (error) {
      throw new Error("");
    }
  }

  async getRecipe(id: number): Promise<Recipe> {
    try {
      const response = await fetch(`${this.getHost()}/recipe/${id}`);
      if (!response.ok) {
        throw new Error("Not 2xx response", { cause: response });
      }
      return await response.json();
    } catch (error) {
      throw new Error("");
    }
  }

  async postRecipe(recipe: Recipe): Promise<Recipe> {
    const response = await fetch(`${this.getHost()}/recipe`, {
      method: "POST",
      body: JSON.stringify({
        Title: recipe.title,
        Description: recipe.description,
        Username: recipe.username,
        MethodSteps: recipe.methodSteps,
        Ingredients: recipe.ingredients,
      }),
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  async deleteRecipe(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.getHost()}/recipe/${id}`, {
        method: "DELETE",
      });

      return;
    } catch (error) {
      throw new Error("Oh no! ");
    }
  }

  async postUser(user: { Username: string; Email: string }) {
    try {
      const response = await fetch(`${this.getHost()}/user`, {
        method: "POST",
        body: JSON.stringify({
          Username: user.Username,
          Email: user.Email,
        }),
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });

      return response.json();
    } catch (error) {
      throw new Error("!!");
    }
  }
}

export const getApi = () => {
  return new Api();
};
