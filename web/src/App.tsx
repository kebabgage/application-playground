import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AddRecipePage } from "./pages/AddRecipePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RecipePage } from "./pages/RecipePage";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { getApi } from "./api/Api";

const queryClient = new QueryClient();

interface PageWrapperProps {
  children: React.ReactNode;
}
const PageWrapper = ({ children }: PageWrapperProps) => {
  const api = getApi();

  const [cookies] = useCookies(["user"]);
  const mutation = useMutation({
    mutationFn: () => {
      return api.postUser({
        Username: cookies.user.username,
        Email: cookies.user.Email,
      });
    },
  });

  useEffect(() => {
    if (cookies.user !== null) {
      console.log("We are already logged in ");
      mutation.mutate();
    }
  }, [cookies.user]);

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
      element: <AddRecipePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/recipe",
      element: <RecipePage />,
    },
  ]);

  const api = getApi();

  return (
    <QueryClientProvider client={queryClient}>
      <PageWrapper>
        <RouterProvider router={router} />
      </PageWrapper>
    </QueryClientProvider>
  );
}

export default App;
