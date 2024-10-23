import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Box, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  differenceInDays,
  format,
  formatDistance,
  fromUnixTime,
  getUnixTime,
  isToday,
  isYesterday,
} from "date-fns";
import { orderBy } from "lodash";
import { useNavigate } from "react-router-dom";
import { getApi } from "../api/Api";
import { RecipeCard } from "../components/RecipeCard";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useGetUser } from "../hooks/useGetUser";
import { Recipe } from "../types/Recipe";
import { User } from "../types/User";
import { EmptyFavouritesContent } from "./util/PageEmpty";
import { Heading, RecipeHeading, SubHeading } from "./util/PageHeading";
import { PageWrapper } from "./util/PageWrapper";

function getRelativeDate(date: Date) {
  const today = new Date();
  if (differenceInDays(today, date) >= 7) {
    return format(date, "E do 'of' MMMM yyyy");
  }

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return formatDistance(today, date, {
    addSuffix: true,
  });
}

function groupByDate(
  data: {
    id: number;
    user: User;
    recipe: Recipe;
    dateFavourited: Date;
  }[],
  sortByValue: "asc" | "desc"
) {
  const result: Record<number, Recipe[]> = {};

  for (const item of data) {
    // const date = format(item.dateFavourited, "E do 'of' MMMM yyyy");
    const date = new Date(item.dateFavourited);
    date.setSeconds(0, 0);
    date.setMinutes(0, 0);
    date.setHours(0, 0);

    // Check if its there already
    if (result[getUnixTime(date)] === undefined) {
      result[getUnixTime(date)] = [item.recipe];
    } else {
      result[getUnixTime(date)].push(item.recipe);
    }
  }

  const sorted = orderBy(
    Object.entries(result),
    (entry) => entry[0],
    sortByValue
  );

  return sorted.map((item) => ({
    day: getRelativeDate(fromUnixTime(Number(item[0]))),
    recipes: item[1],
  }));
}

export const FavouritesPage = () => {
  const api = getApi();
  const [currentUser] = useCurrentUser();
  const { data: user } = useGetUser(currentUser?.id);
  const navigate = useNavigate();
  const theme = useTheme();

  const queryFn = () => {
    if (user?.id === undefined) {
      throw new Error("User cannot be undefiend");
    }
    return api.favourites.getFavourites(user?.id);
  };

  const { data } = useQuery({
    queryFn,
    queryKey: ["favourites", user?.userName],
  });

  const formattedData = data !== undefined ? groupByDate(data, "desc") : [];

  if (formattedData.length === 0) {
    return (
      <PageWrapper>
        <RecipeHeading>
          Hey <span style={{ fontStyle: "italic" }}>{user?.userName}</span>
        </RecipeHeading>
        <Typography variant="h5">Welcome your favourites</Typography>

        <EmptyFavouritesContent />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Heading>Hey {user?.userName}</Heading>
      {formattedData.length !== 0 && (
        <SubHeading>Here are your favourite recipes</SubHeading>
      )}
      {formattedData.length === 0 && <EmptyFavouritesContent />}

      {formattedData.map(({ day, recipes }) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingBottom: 4,
              gap: 2,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <CalendarTodayIcon sx={{ color: theme.palette.grey[800] }} />
              <Typography sx={{ color: theme.palette.grey[800] }}>
                {day}
              </Typography>
            </Box>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => navigate("/recipe" + "?id=" + recipe.id)}
              />
            ))}
          </Box>
        );
      })}
    </PageWrapper>
  );
};
