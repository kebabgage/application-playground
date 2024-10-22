import { styled, Typography } from "@mui/material";
interface HeadingProps {
  children: React.ReactNode;
}

export const Heading = ({ children }: HeadingProps) => {
  return <Typography variant="h4">{children}</Typography>;
};

export const SubHeading = ({ children }: HeadingProps) => {
  return <Typography variant="h6">{children}</Typography>;
};

export const RecipeHeading = ({ children }: HeadingProps) => {
  return (
    <Typography
      variant="h4"
      sx={{
        borderBottom: "solid green",
        // width: "100%",
        paddingX: 3,
        paddingBottom: 1,
      }}
    >
      {children}
    </Typography>
  );
};

const RecipeHeading2 = styled(Typography)({
  borderBottom: "solid green",
  width: "100%",
  paddingX: 3,
  paddingBottom: 1,
});

export const RecipeSubHeading = ({ children }: HeadingProps) => {
  return (
    <Typography
      variant="h6"
      sx={{
        borderBottom: "solid green",
        width: "100%",
        paddingX: 3,
        paddingBottom: 1,
      }}
    >
      {children}
    </Typography>
  );
};
