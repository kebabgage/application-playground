import { Box, Typography, useTheme } from "@mui/material";

interface RecipeDescriptionProps {
  description: string;
}

export const RecipeDescription = ({ description }: RecipeDescriptionProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        // width: isSmallScreen ? "100%" : "60%",
      }}
    >
      <Box
        sx={{
          background: theme.palette.primary.main,
          // border: "solid #00712D",
          padding: 2,
          borderRadius: "10px",
        }}
      >
        <Typography variant="subtitle1">{description}</Typography>
      </Box>
    </Box>
  );
};
