import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getApi } from "../api/Api";
import { DeleteModal } from "../components/DeleteModal";
import { ActionsHeading } from "../components/recipePage/ActionsMenu";
import { RecipeDescription } from "../components/recipePage/Description";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { PageWrapper } from "./util/PageWrapper";
import { getRecipeQueryKey } from "../api/util";
import { RecipeTitle } from "../components/recipePage/Title";

const RecipeHeading = styled(Typography)({
  borderBottom: "solid green",
  width: "100%",
  // paddingX: 3,
  paddingBottom: 1,
});

interface IngredientItemProp {
  ingredient: string;
}

const IngredientItem = ({ ingredient }: IngredientItemProp) => {
  const [checked, setChecked] = useState(false);
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      onClick={() => setChecked(!checked)}
      sx={{ cursor: "pointer" }}
    >
      <Checkbox size="small" checked={checked} sx={{ padding: "5px" }} />
      <Box>
        <Typography
          sx={{ textDecoration: checked ? "line-through" : "default" }}
        >
          {ingredient}
        </Typography>
      </Box>
    </Box>
  );
};

interface MethodStepProps {
  step: string;
  index: number;
}

const MethodStep = ({ step, index }: MethodStepProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      paddingTop={1}
      onClick={() => {
        setChecked(!checked);
      }}
      sx={{ cursor: "pointer" }}
    >
      <Typography
        style={{
          fontWeight: "bold",
          alignSelf: "flex-start",
          paddingRight: 8,
        }}
      >
        {index + 1}.
      </Typography>

      <Typography sx={{ textDecoration: checked ? "line-through" : "default" }}>
        {" " + step}
      </Typography>
    </Box>
  );
};

export const RecipePage = () => {
  const api = getApi();
  const [search] = useSearchParams(window.location.search);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingEnabled, setEditingEnabled] = useState(false);

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
    if (id === null) {
      throw new Error("Id in query parameters is wrong");
    }
    return api.recipes.getRecipe(id);
  };

  const {
    data: recipe,
    isLoading,
    isError,
    isPending,
  } = useQuery({
    queryFn,
    queryKey: getRecipeQueryKey(id ?? undefined),
    refetchInterval: 60000,
  });

  if (isError) {
    return (
      <Box
        height="60%"
        width="50%"
        display="flex"
        flexDirection="column"
        alignContent="center"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Typography variant="h6">Sorry this recipe doesn't exist</Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go back
        </Button>
      </Box>
    );
  }

  if (isLoading || isPending || recipe === undefined) {
    return <CircularProgress />;
  }

  return (
    <PageWrapper showBorder={editingEnabled}>
      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        recipe={recipe}
      />
      <Box
        display="flex"
        flexDirection="row"
        // paddingX={3}
        paddingBottom={3}
        width="100%"
      >
        <RecipeTitle
          title={recipe.title}
          recipe={recipe}
          editingEnabled={editingEnabled}
        />
        {/* //   <RecipeHeading width="75%" flexGrow={2} variant="h4">
      //     {recipe?.title}
      //     {recipe.isArchived === true ? (
      //       <span
      //         style={{
      //           color:
      //             recipe.isArchived === true
      //               ? theme.palette.grey[500]
      //               : "textPrimary",
      //           fontStyle: "italic",
      //         }}
      //       >
      //         {"  "}(archived)
      //       </span>
      //     ) : null}
      //   </RecipeHeading> */}
      </Box>
      <Box
        width="100%"
        display="flex"
        flexDirection={"column"}
        // paddingX={3}
        gap={2}
      >
        <ActionsHeading
          recipe={recipe}
          editMode={editingEnabled}
          setEditMode={setEditingEnabled}
        />
        {recipe.imageUrl !== undefined && recipe.imageUrl !== "" && (
          <Box sx={{ maxHeight: "30rem", borderRadius: "5px" }}>
            <img
              alt={recipe.title + "image"}
              src={api.images.getImageUrl(recipe.imageUrl)}
              // height="90%"
              width="100%"
              height="100%"
              style={{ borderRadius: "5px" }}
            />
          </Box>
        )}
        <RecipeDescription description={recipe.description} />
      </Box>

      {/* Ingredients and Method  */}
      <Box
        width="100%"
        sx={{
          display: "flex",
          flexDirection: "column",
          // paddingX: 3,
          gap: 4,
          paddingBottom: 3,
        }}
      >
        <Box>
          <RecipeHeading
            sx={{ borderBottom: "solid green", width: "100%" }}
            variant="h3"
          >
            Ingredients
          </RecipeHeading>
          {recipe?.ingredients.map((ingredient, index) => (
            <IngredientItem ingredient={ingredient} />
          ))}
        </Box>
        <Box>
          <RecipeHeading variant="h3">Method</RecipeHeading>
          {recipe?.methodSteps.map((step, index) => (
            <MethodStep step={step} index={index} />
          ))}
        </Box>
      </Box>
    </PageWrapper>
  );
};
