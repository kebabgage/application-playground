import SearchIcon from "@mui/icons-material/Search";
import { Box, Input, InputAdornment } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import { getApi } from "../api/Api";
import { Filter } from "../components/search/Filter";
import { SearchResults } from "../components/search/SearchResults";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useGetUser } from "../hooks/useGetUser";
import { User } from "../types/User";
import { EmptySearchContent } from "./util/PageEmpty";
import { RecipeHeading } from "./util/PageHeading";
import { PageWrapper } from "./util/PageWrapper";

export const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [usersFilter, setUserFilter] = useState<User[]>([]);
  const navigate = useNavigate();
  const api = getApi();

  const [currentUser] = useCurrentUser();
  const { data: user } = useGetUser(currentUser?.id);

  const [debouncedSearch] = useDebounceValue(searchValue, 50);

  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => {
      if (debouncedSearch === "" && usersFilter.length === 0) {
        return [];
      }

      const filter: string[] = usersFilter
        .map((u) => u?.email ?? "")
        .filter((u) => u !== "");

      return api.recipes.searchRecipes(debouncedSearch, filter);
    },
    queryKey: [
      "recipes",
      "search",
      debouncedSearch,
      "filter",
      usersFilter.map((u) => u.email).join("&"),
    ],
  });

  // if (searchValue === "") {
  //   return (
  //     <PageWrapper>
  //       <RecipeHeading>Search for your favourite recipes</RecipeHeading>
  //       <EmptySearchContent />
  //     </PageWrapper>
  //   );
  // }

  console.log(usersFilter.length);

  return (
    <PageWrapper>
      <RecipeHeading>Search for your favourite recipes</RecipeHeading>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          // flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Input
          sx={{ width: "50%" }}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search for title, description, ingredients or method"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          width: "50%",
          justifyContent: "flex-start",
        }}
      >
        <Filter
          values={usersFilter}
          onChange={(newValues) => {
            setUserFilter(newValues);
          }}
        />
      </Box>
      {searchValue === "" && usersFilter.length === 0 ? (
        <EmptySearchContent />
      ) : (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            // margin: "5%",
            // width: "95%", // isSmallScreen ? "60%" : "70%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignContent: "center",
            gap: 2,
            paddingBottom: 2,
          }}
        >
          <SearchResults
            data={data}
            isFetching={isLoading}
            searchValue={searchValue}
          />
        </Box>
      )}
    </PageWrapper>
  );
};
