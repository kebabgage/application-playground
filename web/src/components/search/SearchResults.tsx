import { CircularProgress, Typography } from "@mui/material";
import { Recipe } from "../../types/Recipe";
import { RecipeCard } from "../RecipeCard";
import { useNavigate } from "react-router-dom";
import {
  EmptySearchContent,
  NoSearchResults,
} from "../../pages/util/PageEmpty";

interface SearchResultsProps {
  searchValue: string;
  isFetching?: boolean;
  data?: Recipe[];
}

export const SearchResults = ({
  searchValue,
  isFetching,
  data,
}: SearchResultsProps) => {
  const navigate = useNavigate();

  console.log(data);

  if (data?.length === 0) {
    return <NoSearchResults />;
  }

  if (isFetching) {
    return <CircularProgress />;
  }

  return (
    <>
      {data?.map((recipe) => {
        return (
          <RecipeCard
            recipe={recipe}
            onClick={() => navigate(`/recipe?id=${recipe.id}`)}
            searchValue={searchValue}
          />
        );
      })}
    </>
  );
};
