import { useQuery } from "@tanstack/react-query";
import { getApi } from "../api/Api";

export const Recipes = () => {
  const api = getApi();

  const queryFn = () => {
    return api.getRecipes();
  };

  const { data, isLoading } = useQuery({ queryFn, queryKey: ["recipe"] });

  if (data === undefined || isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {data?.map((recipe) => {
        return (
          <div key={recipe.id}>
            <p>{recipe.title}</p>
            <p>{recipe.description}</p>
          </div>
        );
      })}
    </div>
  );
};
