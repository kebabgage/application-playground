import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getApi } from "../api/Api";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { MoreHoriz } from "@mui/icons-material";
import { DeleteModal } from "../components/DeleteModal";

const RecipeHeading = styled(Typography)({
  borderBottom: "solid green",
  width: "55vw",
  paddingX: 3,
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
      <Checkbox size="small" checked={checked} />
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
  const isSmallScreen = useIsSmallScreen();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (option: "Delete" | "Edit") => {
    setAnchorEl(null);
    switch (option) {
      case "Delete":
        setDeleteModalOpen(true);
      // handleDeleteButtonClick();
    }
  };

  // const handleDeleteButtonClick = () => {
  //   deleteMutation.mutate();
  // };

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
      <Box
        height="100%"
        width="100%"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignContent: "center",
          // flexWrap: "wrap",
          // padding: 3,
          marginTop: 4,
        }}
      >
        <DeleteModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          recipe={recipe}
        />
        <Box
          display="flex"
          flexDirection="row"
          paddingX={3}
          paddingBottom={1}
          // width="75%"
        >
          <RecipeHeading width="75%" flexGrow={2} variant="h4">
            {recipe?.title}
          </RecipeHeading>
          <IconButton
            onClick={handleMenu}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <MoreHoriz />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleClose("Edit")}>Edit Recipe</MenuItem>{" "}
            <MenuItem onClick={() => handleClose("Delete")}>
              Delete Recipe
            </MenuItem>
          </Menu>
        </Box>
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          paddingX={3}
          gap={2}
        >
          <Box
            sx={{
              width: isSmallScreen ? "100%" : "60%",
            }}
          >
            <Box sx={{ border: "solid green", padding: 2 }}>
              <Typography variant="subtitle1">{recipe?.description}</Typography>
              <Typography sx={{ paddingTop: 3 }}>
                Brought to you by{" "}
                {recipe?.username === "" ? recipe?.username : "Unknown"}
              </Typography>
            </Box>
          </Box>
          {recipe.imageUrl !== undefined ||
            (recipe.imageUrl !== "" && (
              <Box sx={{ maxHeight: "30rem", borderRadius: "5px" }}>
                <img
                  alt={recipe.title + "image"}
                  src={api.getImageUrl(recipe.imageUrl)}
                  // height="90%"
                  width="100%"
                  height="100%"
                  style={{ borderRadius: "5px" }}
                />
              </Box>
            ))}
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: "column", paddingX: 3, gap: 4 }}
        >
          <Box>
            <RecipeHeading sx={{ borderBottom: "solid green" }} variant="h3">
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
      </Box>
    </>
  );
};
