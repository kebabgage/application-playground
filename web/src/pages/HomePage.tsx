import { Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { RecipesList } from "../components/RecipesList";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useGetUser } from "../hooks/useGetUser";
import { RecipeHeading } from "./util/PageHeading";
import { PageWrapper } from "./util/PageWrapper";

export const HomePage = () => {
  const [currentUser] = useCurrentUser();
  const { data: user } = useGetUser(currentUser?.id);

  if (currentUser?.id === undefined || currentUser == null) {
    return <Navigate to={"/login"} />;
  }

  return (
    <PageWrapper>
      <RecipeHeading>
        Hey, <span style={{ fontStyle: "italic" }}>{user?.userName}</span>
      </RecipeHeading>
      <Typography variant="h5">Welcome your family cookbook</Typography>
      <RecipesList />
    </PageWrapper>
  );
};
