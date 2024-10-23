import { MoreHoriz } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Recipe } from "../../types/Recipe";
import { Avatar } from "../Avatar";
import { DeleteModal } from "../DeleteModal";
import { AddToFavouritesButton } from "./AddToFavouritesButton";
import { ArchiveRecipeMenuItem } from "./ArchiveRecipe";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface ActionsHeadingProps {
  recipe: Recipe;
}

export const ActionsHeading = ({ recipe }: ActionsHeadingProps) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (option: "Archive" | "Delete" | "Edit") => {
    setAnchorEl(null);
    switch (option) {
      case "Archive":
        setOpen(true);
        break;
      case "Delete":
        setOpen(true);
        break;
    }
  };

  return (
    <>
      <DeleteModal recipe={recipe} open={open} setOpen={setOpen} />
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
        <MenuItem onClick={() => handleClose("Edit")}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <ArchiveRecipeMenuItem
          handleClose={() => setAnchorEl(null)}
          recipe={recipe}
        />
        <MenuItem onClick={() => handleClose("Delete")}>
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>{" "}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 1,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography sx={{ fontStyle: "italic" }}>
            Brought to you by
            <Typography
              fontWeight="medium"
              sx={{ display: "inline", fontStyle: "normal" }}
            >
              {" " + (recipe.user.userName ?? "Unknown")}
            </Typography>
          </Typography>
          <Avatar user={recipe.user} size="medium" />
        </Box>
        <Box display="flex" flexDirection="row">
          <AddToFavouritesButton user={recipe.user} recipe={recipe} />
          <IconButton
            onClick={handleMenu}
            // color="primary"
            aria-label="add to shopping cart"
          >
            <MoreHoriz />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};
