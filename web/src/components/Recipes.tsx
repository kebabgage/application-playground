import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApi } from "../api/Api";
import { Recipe } from "../types/Recipe";

export const Recipes = () => {
  const api = getApi();
  const queryClient = useQueryClient();

  const queryFn = () => {
    return api.getRecipes();
  };

  const { data, isLoading } = useQuery({ queryFn, queryKey: ["recipe"] });

  const mutation = useMutation({
    mutationFn: (recipe: Recipe) => {
      return api.deleteRecipe(recipe);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe"] });
    },
    mutationKey: ["DELETE", "recipe"],
  });

  if (data === undefined || isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {data?.map((recipe) => {
        return (
          <div key={recipe.id} style={{ display: "inline" }}>
            <div>
              <p>{recipe.title}</p>
              <p>{recipe.description}</p>
            </div>
            <button onClick={() => mutation.mutate(recipe)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
};
