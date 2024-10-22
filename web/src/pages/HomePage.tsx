import { Navigate } from "react-router-dom";
import { RecipesList } from "../components/RecipesList";
import { useGetUser } from "../hooks/useGetUser";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Heading, RecipeHeading } from "./util/PageHeading";
import { PageWrapper } from "./util/PageWrapper";

export const HomePage = () => {
  const [currentUser] = useCurrentUser();
  const { data: user } = useGetUser(currentUser?.id);

  if (currentUser?.id === undefined || currentUser == null) {
    return <Navigate to={"/login"} />;
  }

  return (
    <PageWrapper>
      <Heading>Welcome, {user?.userName}, to your family cookbook</Heading>
      <RecipesList />
    </PageWrapper>
  );
};
