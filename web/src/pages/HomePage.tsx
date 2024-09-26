import { Typography } from "@mui/material";
import { RecipesList } from "../components/RecipesList";
import { useCookies } from "react-cookie";
import { Navigate, useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);

  console.log(cookies["user"]);

  if (cookies["user"] === undefined) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Typography variant="h2">Recipes 4 All</Typography>
      <Typography>Hej {cookies["user"].username}</Typography>
      <RecipesList />
    </>
  );
};
