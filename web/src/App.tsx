import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecipesList } from "./components/RecipesList";
import { AddRecipe } from "./components/AddRecipe";
import { Typography } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";

const queryClient = new QueryClient();

interface PageWrapperProps {
  children: React.ReactNode;
}
const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div
      id="App"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/new-recipe",
      element: <AddRecipe />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <PageWrapper>
        <RouterProvider router={router} />
      </PageWrapper>
    </QueryClientProvider>
  );
}

export default App;
