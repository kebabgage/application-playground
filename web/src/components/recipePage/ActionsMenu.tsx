import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useCurrentUser, User } from "../../hooks/useCurrentUser";
import { Avatar } from "../Avatar";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { MoreHoriz } from "@mui/icons-material";
import { useState } from "react";
import { DeleteModal } from "../DeleteModal";
import { Recipe } from "../../types/Recipe";
import { AddToFavouritesButton } from "./AddToFavouritesButton";

interface ActionsHeadingProps {
  recipe: Recipe;
}

export const ActionsHeading = ({ recipe }: ActionsHeadingProps) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const user = recipe.user;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (option: "Delete" | "Edit") => {
    setAnchorEl(null);
    switch (option) {
      case "Delete":
        setOpen(true);
      // handleDeleteButtonClick();
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
        <MenuItem onClick={() => handleClose("Edit")}>Edit Recipe</MenuItem>
        <MenuItem onClick={() => handleClose("Delete")}>Delete Recipe</MenuItem>
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
