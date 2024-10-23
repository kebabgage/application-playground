import { Badge, Box, Card, Typography, useTheme } from "@mui/material";
import { Recipe } from "../types/Recipe";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { Avatar } from "./Avatar";
import { Highlighted } from "./search/Highlighted";
import { ListContains } from "./search/ListContains";
import { Favorite } from "@mui/icons-material";

const FavouriteIcon = () => {
  return <Favorite />;
};

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
        // width: "100%",
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
          <Box>
            {recipe.favouritedBy?.map((f) => (
              <Favorite />
            ))}
            <Typography variant="h6">
              {RecipeTitle}{" "}
              {recipe.isArchived ? (
                <span
                  style={{
                    color:
                      recipe.isArchived === true
                        ? theme.palette.grey[500]
                        : "textPrimary",
                    fontStyle: "italic",
                  }}
                >
                  (archived)
                </span>
              ) : null}
            </Typography>
          </Box>
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
