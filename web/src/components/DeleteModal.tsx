import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Recipe } from "../types/Recipe";
import { useCurrentUser } from "../hooks/useUser";
import { Avatar } from "./Avatar";
import { getApi } from "../api/Api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useGetUser } from "../hooks/useGetUser";

interface DeleteModalProps {
  recipe: Recipe;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeleteModal = ({ recipe, open, setOpen }: DeleteModalProps) => {
  const [currentUser, setCurrentUser] = useCurrentUser();
  const { data: user, isLoading } = useGetUser(currentUser?.email);

  const api = getApi();
  const [deleting, setDeleting] = useState(false);

  const { mutate } = useMutation({
    mutationFn: () => {
      if (recipe.id === undefined) {
        throw new Error("Recipe ID shouldn't be undefined");
      }

      setDeleting(true);
      return api.deleteRecipe(recipe.id);
    },
    onSuccess: () => {
      setTimeout(() => {
        setDeleting(false);
      }, 2000);
    },
  });

  if (user === undefined || isLoading) {
    return <CircularProgress />;
  }

  let content;
  if (currentUser?.email !== recipe.user.email) {
    content = (
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
            It might break their heart if you delete their family recipe.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </>
    );
  } else {
    content = (
      <>
        <DialogTitle>
          Are you sure you want to delete this, {user.userName}?{" "}
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
            Delete
          </LoadingButton>
        </DialogActions>
      </>
    );
  }

  return <Dialog open={open}>{content}</Dialog>;
};
