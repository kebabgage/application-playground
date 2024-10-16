import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { getApi } from "./api/Api";
import { AppShell } from "./components/AppShell";
import { useCountry } from "./hooks/useCountry";
import { useCurrentUser } from "./hooks/useUser";
import { AddRecipePage } from "./pages/AddRecipePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecipePage } from "./pages/RecipePage";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./util/theme";

const queryClient = new QueryClient();

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
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {/* <PageWrapper> */}
        <RouterProvider router={router} />
        {/* </PageWrapper> */}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
