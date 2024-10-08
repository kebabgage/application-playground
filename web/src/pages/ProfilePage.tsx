import { Box, Button, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import { Avatar, stringToColor } from "../components/Avatar";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { CameraAlt } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { getApi } from "../api/Api";
import { useState } from "react";
import imageCompression from "browser-image-compression";

export const ProfilePage = () => {
  const [cookies, setCookies] = useCookies(["user"]);
  const api = getApi();
  const [image, setImage] = useState<Blob>();
  // const [image, setImage] = useState<Blob>();

  const onChange = async (image: File) => {
    console.log("compressing hopefully");

    console.log(image.name);

    // const imageFile = event.target.files[0];
    console.log("originalFile instanceof Blob", image instanceof Blob); // true
    console.log(`originalFile size ${image.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      type: image.type,
    };

    try {
      const compressedFile = await imageCompression(image, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      console.log(compressedFile.name);
      console.log(compressedFile);

      setImage(compressedFile);
    } catch (error) {
      console.log(error);
    }

    let imageName;
    try {
      imageName = await api.postImage(image);
      console.log(imageName);
    } catch (error) {
      console.log("Error when trying to save image", error);
    }

    // TODO: Send a real API
    try {
      setCookies("user", { ...cookies.user, img: imageName });
    } catch (error) {}
  };

  // const mutation = useMutation({ mutationFn: () => api.postImage() });

  if (cookies["user"] === undefined) {
    return <Navigate to={"/login"} />;
  }

  console.log(cookies["user"]);

  return (
    <Box height="100%" margin="5%">
      <Typography variant="h4" sx={{ paddingBottom: 2 }}>
        Hi {cookies["user"].username}
      </Typography>
      {cookies["user"].img === undefined ? (
        <AccountCircle
          sx={{
            height: "250px",
            width: "250px",
            fill: stringToColor(cookies.user.username),
          }}
        />
      ) : (
        <Box
          sx={{
            height: "250px",
            width: "250px",
            overflow: "hidden",
            borderRadius: "50%",
            alignItems: "center",
          }}
          overflow="clip"
          borderRadius="125px"
        >
          <img
            style={{
              height: "100%",
              width: "100%",
              textAlign: "center",
              objectFit: "cover",
            }}
            alt={cookies["user"].username + "'s-username"}
            src={api.getImageUrl(cookies["user"].img)}
          />
        </Box>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", paddingTop: 2 }}>
        <Button
          variant="contained"
          endIcon={<CameraAltIcon />}
          component="label"
        >
          Change Profile Picture
          <input
            type="file"
            hidden
            onChange={(event) => {
              if (event.target.files && event.target.files[0]) {
                onChange(event.target.files[0]);
              }
            }}
          />
        </Button>
      </Box>
    </Box>
  );
};
