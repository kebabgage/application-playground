import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Recipes } from "./components/Recipes";
import { AddRecipe } from "./components/AddRecipe";

const queryClient = new QueryClient();

function App() {
  console.log("...");
  return (
    <QueryClientProvider client={queryClient}>
      <div id="App">
        <Recipes />
        <AddRecipe />
      </div>
    </QueryClientProvider>
  );
}

export default App;
