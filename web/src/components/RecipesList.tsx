import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApi } from "../api/Api";
import { Recipe } from "../types/Recipe";
import { Box, Button, Card, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { TagPicker } from "rsuite";
import { RecipeCard } from "./RecipeCard";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";

export const RecipesList = () => {
  const api = getApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();

  const queryFn = () => {
    return api.getRecipes();
  };

  const { data, isLoading } = useQuery({ queryFn, queryKey: ["recipe"] });

  return (
    <Box
      sx={{
        width: isSmallScreen ? "60%" : "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          size="large"
          variant="contained"
          onClick={() => navigate("/new-recipe")}
        >
          Add New Recipe!
        </Button>
      </Box>
      {data?.map((recipe) => (
        <RecipeCard
          recipe={recipe}
          onClick={() => navigate("/recipe" + "?id=" + recipe.id)}
        />
      ))}
    </Box>
  );
};
