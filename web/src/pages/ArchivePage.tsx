import { Box, CircularProgress, Typography } from "@mui/material";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useGetUser } from "../hooks/useGetUser";
import { RecipeHeading } from "./util/PageHeading";
import { PageWrapper } from "./util/PageWrapper";
import { Recipe } from "../types/Recipe";
import { NoArchived } from "./util/PageEmpty";
import { getApi } from "../api/Api";
import { useQuery } from "@tanstack/react-query";
import { RecipeCard } from "../components/RecipeCard";
import { useNavigate } from "react-router-dom";

const useArchivedRecipes = () => {
  const api = getApi();

  const queryFn = () => {
    return api.recipes.getArchivedRecipes();
  };

  return useQuery({ queryFn, queryKey: ["recipes", "archive"] });
};

export const ArchivePage = () => {
  const [currentUser] = useCurrentUser();
  const { data: user } = useGetUser(currentUser?.id);
  const navigate = useNavigate();

  const { data: archived, isLoading } = useArchivedRecipes();

  console.log(archived);

  return (
    <PageWrapper>
      <RecipeHeading>
        Hey, <span style={{ fontStyle: "italic" }}>{user?.userName}</span>
      </RecipeHeading>
      <Typography variant="h5">Welcome to the archive</Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: 4,
          gap: 2,
          width: "100%",
        }}
      >
        {isLoading && <CircularProgress />}
        {archived === undefined || archived?.length === 0 ? (
          <NoArchived />
        ) : (
          archived.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => navigate("/recipe" + "?id=" + recipe.id)}
            />
          ))
        )}
      </Box>
    </PageWrapper>
  );
};
