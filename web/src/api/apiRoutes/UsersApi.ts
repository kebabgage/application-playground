import { User } from "../../hooks/useCurrentUser";
import { getHost } from "../util";

export class UsersApi {
  async keepUserActive(email: string) {
    try {
      const response = await fetch(`${getHost()}/users`, {
        method: "POST",
        body: JSON.stringify({
          Email: email,
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

  async updateUser(user: Partial<User>) {
    const body = JSON.stringify(user);

    console.log(body);

    try {
      const response = await fetch(`${getHost()}/users`, {
        method: "PUT",
        body: body,
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

  async postUser(user: User) {
    try {
      const response = await fetch(`${getHost()}/users`, {
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

  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${getHost()}/users/`);
      return response.json();
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async getUser(id: number): Promise<User> {
    try {
      const response = await fetch(`${getHost()}/users/${id}`);
      return response.json();
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const response = await fetch(`${getHost()}/users/email=${email}`);
      return response.json();
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }
}
