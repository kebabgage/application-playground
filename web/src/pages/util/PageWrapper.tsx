import { Box, useTheme } from "@mui/material";

interface PageWrapperProps {
  children: React.ReactNode;
  showBorder?: boolean;
}

export const PageWrapper = ({
  children,
  showBorder = false,
}: PageWrapperProps) => {
  const theme = useTheme();

  const vw = window.innerWidth;
  // console.log("viewportwidth", vw);
  // console.log("viewportwidth * 0.95", vw * 0.95);
  // // usually its 95
  // when its 100
  // 95 + (0.05 - 20)
  // console.log(vw * 0.95);
  const five_percent = vw * 0.05;
  const border = vw * 0.02;
  const padding = (vw * 0.01) / 2;

  console.log("-five percent-", five_percent);
  console.log("border", border);
  console.log("padding", padding);
  return (
    <Box
      sx={{
        height: "100%",
        paddingTop: showBorder === false ? `${vw * 0.02}px` : `${vw * 0.0}px`,
        width: "95%", // "100vw", // "95vw", // showBorder === false ? "95vw" : "100vw", //: "95vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "center",
        gap: 2,
        // DELETING THIS:
        paddingBottom: 5,
        // marginBottom: 5,
        // From SearchPage.tsx
        alignItems: "center",
        border:
          showBorder === false
            ? undefined
            : `${theme.palette.secondary.light} solid ${border}px`,
        paddingX: showBorder === false ? undefined : `${padding}px`,
        // border:
        //   showBorder === false
        //     ? undefined
        //     : `solid ${theme.palette.secondary.light} 10px`,
        // paddingX: showBorder === false ? undefined : "5vw", // `calc(5vw - 10px)`,
        // margin: showBorder === false ? undefined : `calc(5vw - 20px)`,
      }}
    >
      {children}
    </Box>
  );
};
