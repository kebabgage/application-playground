import { Box, Typography } from "@mui/material";
import { RecipesList } from "../components/RecipesList";
import { useCookies } from "react-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import { useCountry } from "../hooks/useCountry";
import { useEffect } from "react";
// import {} from "../../node_modules/svg-country-flags/png100px/";

export const HomePage = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);
  const [country, setCountry] = useCountry();

  if (cookies["user"] === undefined) {
    return <Navigate to={"/login"} />;
  }

  return (
    <Box
      height="100%"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <RecipesList />
    </Box>
  );
};
