import { Box, Card, CircularProgress, Input, Typography } from "@mui/material";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { getApi } from "../api/Api";
import { escapeRegExp } from "lodash";
import { useDebounceValue } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { SearchResults } from "../components/search/SearchResults";
import { Filter } from "../components/search/Filter";
import { User } from "../hooks/useUser";

export const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [usersFilter, setUserFilter] = useState<User[]>([]);
  const navigate = useNavigate();
  const api = getApi();

  const [debouncedSearch] = useDebounceValue(searchValue, 50);

  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => {
      if (debouncedSearch === "" && usersFilter.length === 0) {
        return [];
      }

      return api.recipes.searchRecipes(
        debouncedSearch,
        usersFilter.map((u) => u.email)
      );
    },
    queryKey: [
      "recipes",
      "search",
      debouncedSearch,
      "filter",
      usersFilter.map((u) => u.email).join("&"),
    ],
  });

  return (
    <Box
      height="100%"
      width="100%"
      sx={{
        height: "100%",
        margin: "5%",
        width: "95%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "center",
        gap: 2,
        paddingBottom: 5,
        alignItems: "center",
      }}
    >
      <Typography variant="h4">Search For Recipes</Typography>
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
            console.log(newValues);
            setUserFilter(newValues);
          }}
        />
      </Box>
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
    </Box>
  );
};
