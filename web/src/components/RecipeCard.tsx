import { Box, Card, Typography, useTheme } from "@mui/material";
import { Recipe } from "../types/Recipe";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { Avatar } from "./Avatar";
import { Highlighted } from "./search/Highlighted";
import { ListContains } from "./search/ListContains";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      height: "20px",
      width: "20px",
      alignItems: "center",
      marginRight: 0.5,
      fontSize: "0.75rem",
    },
    children: `${name[0].toUpperCase()}`,
  };
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  searchValue?: string;
}
export const RecipeCard = ({
  recipe,
  onClick,
  searchValue,
}: RecipeCardProps) => {
  const theme = useTheme();
  const isSmallScreen = useIsSmallScreen();

  const RecipeTitle =
    searchValue === "" ? (
      recipe.title
    ) : (
      <Highlighted text={recipe.title} highlight={searchValue} />
    );

  const Description =
    searchValue === "" ? (
      recipe.description
    ) : (
      <Highlighted text={recipe.description} highlight={searchValue} />
    );

  return (
    <Card
      onClick={onClick}
      sx={{
        ":hover": {
          boxShadow: 5,
          cursor: "pointer",
        },
        padding: 1,
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">{RecipeTitle}</Typography>
          {recipe.user !== null && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography fontStyle="italic">
                From{" "}
                <span style={{ fontWeight: "bold" }}>
                  {recipe.user.userName}
                </span>
              </Typography>

              <Avatar user={recipe.user} />
            </Box>
          )}
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.grey[600],
            maxWidth: "100%",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {Description}
        </Typography>
        {searchValue === "" ? null : (
          <Box display="flex" flexDirection="row" gap={8}>
            <ListContains
              searchValue={searchValue}
              ingredients={recipe.ingredients}
              listName="Ingredients"
              limit={3}
            />
            <ListContains
              searchValue={searchValue}
              ingredients={recipe.methodSteps}
              listName="Method"
              limit={2}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
};
