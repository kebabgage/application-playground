import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell as Shell } from "./components/AppShell";
import { AddRecipePage } from "./pages/AddRecipePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecipePage } from "./pages/RecipePage";
import { theme } from "./util/theme";
import React from "react";
import { SearchPage } from "./pages/SearchPage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FavouritesPage } from "./pages/FavouritesPage";

const queryClient = new QueryClient();

const AppShell = React.memo(Shell);

interface PageWrapperProps {
  showAppBar?: boolean;
  children: React.ReactNode;
}

const PageWrapper = ({ children, showAppBar = true }: PageWrapperProps) => (
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
    {
      path: "/search",
      element: (
        <PageWrapper>
          <SearchPage />
        </PageWrapper>
      ),
    },
    {
      path: "/favourites",
      element: (
        <PageWrapper>
          <FavouritesPage />
        </PageWrapper>
      ),
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />

      <ThemeProvider theme={theme}>
        {/* <PageWrapper> */}
        <RouterProvider router={router} />
        {/* </PageWrapper> */}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
