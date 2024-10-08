import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { AddRecipePage } from "./pages/AddRecipePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RecipePage } from "./pages/RecipePage";
import { useCookies } from "react-cookie";
import { useCallback, useEffect, useState } from "react";
import { getApi } from "./api/Api";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useCountry } from "./hooks/useCountry";
import { Avatar } from "./components/Avatar";
import { ProfilePage } from "./pages/ProfilePage";
import userEvent from "@testing-library/user-event";

const queryClient = new QueryClient();

interface PageWrapperProps {
  showAppBar?: boolean;
  children: React.ReactNode;
}
const PageWrapper = ({ children, showAppBar = true }: PageWrapperProps) => {
  const api = getApi();
  const [country] = useCountry();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [cookies, setCookies] = useCookies(["user"]);

  const mutationFn = useCallback(() => {
    return api.postUser({
      Username: cookies.user.username,
      Email: cookies.user.Email,
    });
  }, [api, cookies.user]);

  const { mutate } = useMutation({
    mutationFn,
    mutationKey: ["post", "user"],
  });

  useEffect(() => {
    if (cookies.user !== null) {
      mutate();
    }
  }, [cookies.user, mutate]);

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
        setCookies("user", undefined);
        break;
    }
  };

  return (
    <div
      id="App"
      style={{
        width: "100vw",
        height: "100vh",
        // height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
      }}
    >
      {showAppBar && (
        <>
          <AppBar
            position="sticky"
            color="transparent"
            sx={{ bgcolor: "white", display: "flex", flexDirection: "column" }}
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
                sx={{ flexGrow: 1 }}
              >
                {country.title}
              </Typography>
              {cookies.user && (
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Avatar
                      name={cookies.user.username}
                      img={api.getImageUrl(cookies.user.img)}
                    />
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
          <Toolbar />
          {children}
        </>
      )}
    </div>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PageWrapper>
          <HomePage />
        </PageWrapper>
      ),
    },
    {
      path: "/new-recipe",
      element: (
        <PageWrapper>
          <AddRecipePage />
        </PageWrapper>
      ),
    },
    {
      path: "/login",
      element: (
        <PageWrapper showAppBar={false}>
          <LoginPage />
        </PageWrapper>
      ),
    },
    {
      path: "/recipe",
      element: (
        <PageWrapper>
          <RecipePage />
        </PageWrapper>
      ),
    },
    {
      path: "/profile",
      element: (
        <PageWrapper>
          <ProfilePage />
        </PageWrapper>
      ),
    },
  ]);

  const api = getApi();

  return (
    <QueryClientProvider client={queryClient}>
      {/* <PageWrapper> */}
      <RouterProvider router={router} />
      {/* </PageWrapper> */}
    </QueryClientProvider>
  );
}

export default App;
