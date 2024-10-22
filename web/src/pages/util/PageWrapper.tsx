import { Box } from "@mui/material";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  // SearchPage.tsx
  /**
   *  sx={{
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
   */
  return (
    <Box
      height="100%"
      width="100%"
      sx={{
        height: "100%",
        margin: "5%",
        marginTop: "2%",
        width: "95%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "center",
        gap: 2,
        paddingBottom: 5,
        // From SearchPage.tsx
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  );
};
