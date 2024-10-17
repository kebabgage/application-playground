import { Box, Card, CircularProgress, Input, Typography } from "@mui/material";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { getApi } from "../api/Api";
import { escapeRegExp } from "lodash";
import { useDebounceValue } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { SearchResults } from "../components/search/SearchResults";

export const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const api = getApi();

  const [debouncedSearch] = useDebounceValue(searchValue, 50);

  const { data, isFetching, isLoading } = useQuery({
    queryFn: () => {
      if (debouncedSearch === "") {
        return [];
      }

      return api.searchRecipes(debouncedSearch);
    },
    queryKey: ["recipes", "search", debouncedSearch],
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
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          // flexGrow: 1,
        }}
      >
        <Input
          sx={{ width: "50%" }}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search for title, description, ingredients or method"
        />
      </Box>
      <SearchResults
        data={data}
        isFetching={isLoading}
        searchValue={searchValue}
      />
    </Box>
  );
};
