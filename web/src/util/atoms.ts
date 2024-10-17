import { atomWithStorage } from "jotai/utils";
import { Recipe } from "../types/Recipe";
import { useAtom } from "jotai";

const currentRecipe = atomWithStorage<Recipe | null>("recipe", null);
export const useCurrentRecipe = () => useAtom(currentRecipe);
