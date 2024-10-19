import {
  AppBar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
  Drawer as MuiDrawer,
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
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";

const getIcon = (name: string) => {
  switch (name) {
    case "Home":
      return <HomeIcon />;
    case "Search":
      return <SearchIcon />;
    case "Faves":
      return <FavoriteIcon />;
    case "Archive":
      return <DeleteIcon />;
    default:
      return <MenuIcon />;
  }
};
interface DrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Drawer = ({ open, setOpen }: DrawerProps) => {
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const onClick = (text: string) => {
    switch (text) {
      case "Home":
        navigate("/");
        break;
      case "Faves":
        navigate("/favourites");
        break;
      case "Archive":
        navigate("/archive");
        break;
      case "Search":
        navigate("/search");
    }
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Search", "Home", "Faves", "Archive"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => onClick(text)}>
              <ListItemIcon>{getIcon(text)}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <MuiDrawer open={open} onClose={toggleDrawer(false)}>
      {DrawerList}
    </MuiDrawer>
  );
};

export const AppShell = () => {
  const [currentUser, setCurrentUser] = useCurrentUser();
  useKeepUserActive(currentUser);

  const navigate = useNavigate();
  const [country] = useCountry();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const api = getApi();

  const { data: userInfo } = useQuery({
    queryFn: () => {
      if (currentUser?.email === undefined) {
        throw new Error("We can't fetch without an email set...");
      }

      return api.users.getUser(currentUser.email);
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

  return (
    <>
      <Drawer open={drawerOpen} setOpen={setDrawerOpen} />
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
            onClick={() => setDrawerOpen(!drawerOpen)}
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
                <MenuItem onClick={() => handleClose("Logout")}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {/* <Toolbar /> */}
    </>
  );
};
