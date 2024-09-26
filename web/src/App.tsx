import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AddRecipePage } from "./pages/AddRecipePage";
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
        width: "100vw",
        height: "100vh",
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
      element: <AddRecipePage />,
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
