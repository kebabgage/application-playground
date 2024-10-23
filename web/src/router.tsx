import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell as Shell } from "./components/AppShell";
import { AddRecipePage } from "./pages/AddRecipePage";
import { ArchivePage } from "./pages/ArchivePage";
import { FavouritesPage } from "./pages/FavouritesPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecipePage } from "./pages/RecipePage";
import { SearchPage } from "./pages/SearchPage";

const AppShell = React.memo(Shell);

interface PageWrapperProps {
  showAppBar?: boolean;
  children: React.ReactNode;
}

const RouteWrapper = ({ children, showAppBar = true }: PageWrapperProps) => (
  <div
    id="App"
    style={{
      width: "100vw",
      height: "100vh",
      // height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: showAppBar === true ? "inherit" : "center",
      overflowY: "auto",
    }}
  >
    {showAppBar ? (
      <>
        <AppShell />
        {children}
      </>
    ) : (
      children
    )}
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouteWrapper>
        <HomePage />
      </RouteWrapper>
    ),
  },
  {
    path: "/new-recipe",
    element: (
      <RouteWrapper>
        <AddRecipePage />
      </RouteWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <RouteWrapper showAppBar={false}>
        <LoginPage />
      </RouteWrapper>
    ),
  },
  {
    path: "/recipe",
    element: (
      <RouteWrapper>
        <RecipePage />
      </RouteWrapper>
    ),
  },
  {
    path: "/profile",
    element: (
      <RouteWrapper>
        <ProfilePage />
      </RouteWrapper>
    ),
  },
  {
    path: "/search",
    element: (
      <RouteWrapper>
        <SearchPage />
      </RouteWrapper>
    ),
  },
  {
    path: "/favourites",
    element: (
      <RouteWrapper>
        <FavouritesPage />
      </RouteWrapper>
    ),
  },
  {
    path: "/archive",
    element: (
      <RouteWrapper>
        <ArchivePage />
      </RouteWrapper>
    ),
  },
]);
