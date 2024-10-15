import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useCountry } from "../hooks/useCountry";
import { useCurrentUser } from "../hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getApi } from "../api/Api";
import { Avatar } from "./Avatar";
import { useKeepUserActive } from "../hooks/useKeepUserActive";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}

// export function HideOnScroll(props: Props) {
//   const { children } = props;
//   console.log(window);
//   // Note that you normally won't need to set the window ref as useScrollTrigger
//   // will default to window.
//   // This is only being set here because the demo is in an iframe.
//   // const trigger = useScrollTrigger({ target: });

//   console.log(trigger);

//   return (
//     <Slide appear={false} direction="down" in={!trigger}>
//       {children ?? <div />}
//     </Slide>
//   );
// }

export const AppShell = () => {
  const [currentUser, setCurrentUser] = useCurrentUser();
  useKeepUserActive(currentUser);

  const navigate = useNavigate();
  const [country] = useCountry();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const api = getApi();

  const { data: userInfo } = useQuery({
    queryFn: () => {
      if (currentUser?.email === undefined) {
        throw new Error("We can't fetch without an email set...");
      }

      return api.getUser(currentUser.email);
    },

    queryKey: ["user", `email=${currentUser?.email}}`],
  });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (option: "Profile" | "Logout") => {
    setAnchorEl(null);

    switch (option) {
      case "Profile":
        // Navigate to the profile page
        navigate("/profile");
        break;
      case "Logout":
        await api.logout();
        setCurrentUser(null);
        navigate("/login");
        break;
    }
  };

  // console.log("App Shell >>", userInfo);

  return (
    <AppBar
      color="transparent"
      sx={{ bgcolor: "white", display: "flex", flexDirection: "column" }}
      position="sticky"
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="a"
          onClick={() => navigate("/")}
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
        >
          {country.title}
        </Typography>
        {userInfo !== undefined && (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar user={userInfo} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleClose("Profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => handleClose("Logout")}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};
