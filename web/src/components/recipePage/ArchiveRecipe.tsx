import { LoadingButton } from "@mui/lab";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "../../types/Recipe";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useGetUser } from "../../hooks/useGetUser";
import { getApi } from "../../api/Api";
import { Avatar } from "../Avatar";
import RecyclingIcon from "@mui/icons-material/Recycling";
import { getRecipeQueryKey } from "../../api/util";

interface NotRecipeMakerProps {
  recipe: Recipe;
  setOpen: (open: boolean) => void;
}

const NotRecipeMaker = ({ setOpen, recipe }: NotRecipeMakerProps) => {
  return (
    <>
      <DialogTitle>Did you make this recipe?</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography>
          According to our records, {recipe.user.userName} made this.
        </Typography>
        <Avatar user={recipe.user} size="large" />

        <Typography>
          It might break their heart if you Archive their family recipe.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </>
  );
};

interface ArchiveModalProps {
  recipe: Recipe;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ArchiveModal = ({ recipe, open, setOpen }: ArchiveModalProps) => {
  const [currentUser, setCurrentUser] = useCurrentUser();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetUser(currentUser?.id);
  const navigate = useNavigate();

  const api = getApi();
  const [deleting, setDeleting] = useState(false);

  const { mutate } = useMutation({
    mutationFn: () => {
      if (recipe.id === undefined) {
        throw new Error("Recipe ID shouldn't be undefined");
      }

      setDeleting(true);
      return api.recipes.archiveRecipe(recipe);
    },
    onSuccess: () => {
      setTimeout(() => {
        setDeleting(false);

        setOpen(false);
        // navigate("/");
      }, 2000);
    },
  });

  if (user === undefined || isLoading) {
    return <CircularProgress />;
  }

  let content;
  if (currentUser?.id !== recipe.user.id) {
    content = <NotRecipeMaker recipe={recipe} setOpen={setOpen} />;
  } else {
    content = (
      <>
        <DialogTitle>
          Are you sure you want to Archive this, {user.userName}?{" "}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {deleting ? (
            <Typography>
              Just one second while we apologise to your family, {user.userName}
            </Typography>
          ) : (
            <Typography>
              We don't want you deleting any of your cherished, family recipes
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Back
          </Button>
          <LoadingButton
            variant="contained"
            color="error"
            loading={deleting}
            onClick={() => mutate()}
          >
            Archive
          </LoadingButton>
        </DialogActions>
      </>
    );
  }

  return <Dialog open={open}>{content}</Dialog>;
};

interface ArchiveMenuItemProps {
  recipe: Recipe;
  handleClose: () => void;
}

export const ArchiveRecipeMenuItem = ({
  recipe,
  handleClose,
}: ArchiveMenuItemProps) => {
  const [open, setOpen] = useState(false);
  const api = getApi();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => {
      if (recipe.id === undefined) {
        throw new Error("Recipe ID shouldn't be undefined");
      }

      if (recipe.isArchived === true) {
        return api.recipes.unArchiveRecipe(recipe);
      }
      return api.recipes.archiveRecipe(recipe);
    },
    onSuccess: () => {
      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: getRecipeQueryKey(recipe.id),
      });

      handleClose();
    },
  });

  return (
    <>
      <MenuItem
        onClick={() => {
          mutate();
        }}
      >
        <ListItemIcon>
          <RecyclingIcon />
        </ListItemIcon>
        <ListItemText>
          {recipe.isArchived ? "Unarchive" : "Archive"}
        </ListItemText>
      </MenuItem>
    </>
  );
};
