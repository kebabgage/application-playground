import { Box, Divider, Typography } from "@mui/material";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import SearchOff from "@mui/icons-material/SearchOff";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import HikingIcon from "@mui/icons-material/Hiking";

export const EmptyFavouritesContent = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 4,
          textAlign: "center",
        }}
      >
        <HeartBrokenIcon color="error" style={{ fontSize: 150 }} />
        <Typography variant="h6">
          Looks like you haven't favourited anything
        </Typography>
      </Box>
    </>
  );
};

export const EmptySearchContent = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 4,
          textAlign: "center",
        }}
      >
        <SearchOff color="secondary" style={{ fontSize: 150 }} />
        <Typography variant="h6">
          Use the search bar or filters to find the recipe of your dreams
        </Typography>
      </Box>
    </>
  );
};

export const NoSearchResults = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 4,
          textAlign: "center",
        }}
      >
        <SentimentNeutralIcon style={{ fontSize: 150 }} />
        <Typography variant="h6">
          Hmmmmm.... did you imagine that recipe?
        </Typography>
      </Box>
    </>
  );
};

export const NoArchived = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 4,
          textAlign: "center",
        }}
      >
        <HikingIcon color="primary" style={{ fontSize: 150 }} />
        <Typography variant="h6">
          Looks like there are no archived recipes...
        </Typography>
      </Box>
    </>
  );
};
