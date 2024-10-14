import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Recipe } from "../types/Recipe";
import { useCurrentUser } from "../hooks/useUser";
import { Avatar } from "./Avatar";

interface DeleteModalProps {
  recipe: Recipe;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeleteModal = ({ recipe, open, setOpen }: DeleteModalProps) => {
  const [currentUser, setCurrentUser] = useCurrentUser();

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
          Are you sure you want to delete this, {currentUser.userName}?{" "}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography>
            We don't want you deleting any of your cherished, family recipes
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </>
    );
  }

  return <Dialog open={open}>{content}</Dialog>;
};
