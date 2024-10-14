import { responsiveFontSizes } from "@mui/material";
import { User } from "../hooks/useUser";
import { Recipe } from "../types/Recipe";
import OpenAI from "openai";
// if (process.env.OPEN_AI_KEY !== undefined){
//   const openai = new OpenAI({
//     dangerouslyAllowBrowser: true,
//     apiKey: process.env.OPEN_AI_KEY,
//   });
// }

export class Api {
  getHost(): string {
    if (process.env.NODE_ENV === "production") {
      return `http://${window.location.host}/api`;
    } else {
      return "http://localhost:8000";
    }
  }

  getImageUrl(imageName: string): string {
    return `${this.getHost()}/images/${imageName}`;
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

  async postImage(image: any) {
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch(
        `${this.getHost()}/images?originalFileName=${image.name}`,
        {
          method: "POST",
          body: formData,
          // headers: {
          //   Accept: "*/*",
          //   "Content-Type": "multipart/form-data",
          // },
        }
      );

      return response.json();
    } catch (error) {
      throw new Error("!");
    }
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

  async postUser(user: User) {
    try {
      const response = await fetch(`${this.getHost()}/users`, {
        method: "POST",
        body: JSON.stringify({
          Username: user.userName,
          Email: user.email,
          ProfileImage: user.profileImage,
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

  async getUser(email: string): Promise<User> {
    try {
      const response = await fetch(`${this.getHost()}/users/email=${email}`);
      return response.json();
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async generateDescriptionAI(title: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.getHost()}/ai/description?title=${title}`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      return response.json();
    } catch (error) {
      throw new Error("Error generating description" + error);
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
