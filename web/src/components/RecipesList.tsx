import { Box, Button } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getApi } from "../api/Api";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { RecipeCard } from "./RecipeCard";

export const RecipesList = () => {
  const api = getApi();
  const navigate = useNavigate();

  const queryFn = () => {
    return api.getRecipes();
  };

  const { data, isLoading } = useQuery({ queryFn, queryKey: ["recipe"] });

  return (
    <Box
      sx={{
        height: "100%",
        margin: "5%",
        width: "95%", // isSmallScreen ? "60%" : "70%",
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
