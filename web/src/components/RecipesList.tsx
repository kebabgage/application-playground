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
        height: "100%",
        margin: "5%",
        // width: "100%", // isSmallScreen ? "60%" : "70%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "center",
        gap: 2,
        paddingBottom: 2,
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
          key={recipe.id}
          recipe={recipe}
          onClick={() => navigate("/recipe" + "?id=" + recipe.id)}
        />
      ))}
    </Box>
  );
};
