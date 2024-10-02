import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProgressCircle from "rsuite/esm/Progress/ProgressCircle";
import { getApi } from "../api/Api";

export const RecipePage = () => {
  const api = getApi();
  const [search] = useSearchParams(window.location.search);
  const navigate = useNavigate();

  /**
   * The recipe id, derived from the search parameters
   */
  const id = useMemo(() => {
    if (search.get("id") === null) {
      throw new Error("Cannot find the recipe you wanted...");
    }

    return search.get("id") as unknown as number;
  }, [search]);

  const queryFn = () => {
    const id = search.get("id") as unknown as number;
    if (id === null) {
      throw new Error("Id in query parameters is wrong");
    }
    return api.getRecipe(id);
  };

  const {
    data: recipe,
    isLoading,
    isError,
  } = useQuery({
    queryFn,
    queryKey: ["recipes", search.get("id")],
    refetchInterval: 60000,
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      return api.deleteRecipe(id);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleDeleteButtonClick = () => {
    deleteMutation.mutate();
  };

  if (isError) {
    return (
      <>
        <Typography>Sorry this recipe doesn't exist</Typography>
        <Button variant="contained">Go back</Button>
      </>
    );
  }

  if (isLoading || recipe === undefined) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box height="100vh">
        <Button onClick={handleDeleteButtonClick}>Delete</Button>
        <Typography variant="h1">{recipe?.title}</Typography>
        <Typography variant="subtitle1">{recipe?.description}</Typography>
        <Typography>Brought to you by {recipe?.username}</Typography>
        <Typography variant="h3">Ingredients</Typography>
        {recipe?.ingredients.map((ingredient) => (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Checkbox size="small" />
            <Typography>{ingredient}</Typography>
          </Box>
        ))}
        <Typography variant="h3">Method</Typography>
        {recipe?.methodSteps.map((ingredient) => (
          <Typography>{ingredient}</Typography>
        ))}
        {recipe.imageUrl && <img src={api.getImageUrl(recipe.imageUrl)} />}
      </Box>
    </>
  );
};
