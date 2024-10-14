import { Box } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { RecipesList } from "../components/RecipesList";
import { useCountry } from "../hooks/useCountry";
import { useCurrentUser } from "../hooks/useUser";

export const HomePage = () => {
  const [user] = useCurrentUser();

  if (user === null) {
    return <Navigate to={"/login"} />;
  }

  return (
    <Box
      height="100%"
      width="100%"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <RecipesList />
    </Box>
  );
};
