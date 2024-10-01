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

  useEffect(() => {
    setCountry();
  }, []);

  if (cookies["user"] === undefined) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Typography variant="h2">{country.title}</Typography>
        <img
          height="50px"
          width="50px"
          title="Flag"
          style={{ marginLeft: "20px" }}
          alt="Flag"
          src={process.env.PUBLIC_URL + "/flags/" + country.src}
        />
      </Box>

      {/*<Typography>Hej {cookies["user"].username}</Typography> */}
      <RecipesList />
    </>
  );
};
