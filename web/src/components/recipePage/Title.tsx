import InlineEdit from "@atlaskit/inline-edit";
import { Box, css, IconButton, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import { RecipeHeading } from "../../pages/util/PageHeading";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { getApi } from "../../api/Api";
import { Recipe } from "../../types/Recipe";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipeQueryKey } from "../../api/util";
import EditIcon from "@mui/icons-material/Edit";

interface RecipeTitleProps {
  title: string;
  recipe: Recipe;
  editingEnabled?: boolean;
}

export const RecipeTitle = ({
  title,
  recipe,
  editingEnabled,
}: RecipeTitleProps) => {
  const [editValue, setEditValue] = useState(title);
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();

  const api = getApi();

  const mutationFn = () => {
    return api.recipes.updateRecipe({ ...recipe, title: editValue });
  };

  const { mutate } = useMutation({
    mutationFn,
    mutationKey: ["recipe", `${recipe.id}`],
    onSuccess: (recipe) => {
      console.log("Updated recipe", recipe);

      queryClient.invalidateQueries({ queryKey: getRecipeQueryKey(recipe.id) });
    },
  });

  const theme = useTheme();

  const handleDone = () => {
    setEditMode(false);

    // Update the value
    mutate();
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  if (editMode === true) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          // paddingBottom: "-40px",
          width: "100%",
        }}
      >
        <TextField
          multiline
          value={editValue}
          onChange={(event) => setEditValue(event.target.value)}
          autoFocus
          fullWidth
          // onBlur={() => setEditMode(false)}
          sx={{
            flexGrow: 1,
            paddingY: 0,
          }}
          InputProps={{
            sx: {
              padding: 0,
              paddingX: "24px",
              paddingBottom: "8px",
              // width: "100%",
              // "& .MuiInputBase-input": {
              //   padding: 0,
              // },
            },
          }}
          inputProps={{ style: theme.typography.h4, paddingY: 0 }} // font size of input text
        />
        <Box display="flex" flexDirection="row" justifyContent="flex-end">
          <IconButton sx={{ position: "relative" }} onClick={handleDone}>
            <DoneIcon color="success" sx={{ opacity: "0.7" }} />
          </IconButton>
          <IconButton sx={{ position: "relative" }} onClick={handleCancel}>
            <CloseIcon color="error" sx={{ opacity: "0.7" }} />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box onClick={() => (editingEnabled ? setEditMode(!editMode) : undefined)}>
      <RecipeHeading /*width="100%"*/>
        {title}
        {editingEnabled === false ? null : (
          <IconButton onClick={() => setEditMode(!editMode)}>
            <EditIcon />
          </IconButton>
        )}
        {recipe.isArchived === true && editingEnabled === false ? (
          <span
            style={{
              color:
                recipe.isArchived === true
                  ? theme.palette.grey[500]
                  : "textPrimary",
              fontStyle: "italic",
            }}
          >
            {"  "}(archived)
          </span>
        ) : null}
      </RecipeHeading>
    </Box>
  );
};
