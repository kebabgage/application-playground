import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { theme } from "./util/theme";
import { router } from "./router";

const queryClient = new QueryClient();

function App() {
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
