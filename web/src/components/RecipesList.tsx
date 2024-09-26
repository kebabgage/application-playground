import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApi } from "../api/Api";
import { Recipe } from "../types/Recipe";
import { Box, Button, Card, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export const RecipesList = () => {
  const api = getApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    <Box
      sx={{
        width: "60%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        gap: 2,
      }}
    >
      <Button variant="contained" onClick={() => navigate("/new-recipe")}>
        Add New Recipe!
      </Button>
      {data?.map((recipe) => {
        return (
          <Card key={recipe.id}>
            <div>
              <Typography>{recipe.title}</Typography>
              <Typography>{recipe.description}</Typography>
            </div>
          </Card>
        );
      })}
    </Box>
  );
};
