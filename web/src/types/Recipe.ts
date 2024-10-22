import { User } from "../hooks/useCurrentUser";

export interface Recipe {
  id?: number;
  title: string;
  description: string;
  username?: string;
  ingredients: string[];
  methodSteps: string[];
  imageUrl: string;
  user: User;
  favouritedBy?: string[];
}
