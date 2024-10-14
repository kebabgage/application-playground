import AccountCircle from "@mui/icons-material/AccountCircle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Box, Button, Typography } from "@mui/material";
import imageCompression from "browser-image-compression";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { getApi } from "../api/Api";
import { stringToColor } from "../components/Avatar";
import { useCurrentUser } from "../hooks/useUser";
import { LoadingButton } from "@mui/lab";
import { useQueryClient } from "@tanstack/react-query";

export const ProfilePage = () => {
  const [user, setUser] = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const api = getApi();
  const [image, setImage] = useState<Blob>();
  // const [image, setImage] = useState<Blob>();

  const onChange = async (image: File) => {
    setLoading(true);
    // console.log("compressing hopefully");

    // console.log(image.name);

    // const imageFile = event.target.files[0];
    // console.log("originalFile instanceof Blob", image instanceof Blob); // true
    // console.log(`originalFile size ${image.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      type: image.type,
    };

    try {
      const compressedFile = await imageCompression(image, options);
      // console.log(
      //   "compressedFile instanceof Blob",
      //   compressedFile instanceof Blob
      // ); // true
      // console.log(
      //   `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      // ); // smaller than maxSizeMB

      // console.log(compressedFile.name);
      // console.log(compressedFile);

      setImage(compressedFile);
    } catch (error) {
      console.error(error);
    }

    let imageName;
    try {
      imageName = await api.postImage(image);
      // console.log(imageName);
    } catch (error) {
      console.error("Error when trying to save image", error);
    }

    // TODO: Send a real API
    try {
      if (user !== null) {
        setUser({
          userName: user?.userName,
          email: user.email,
          profileImage: imageName,
        });

        console.log(imageName);

        await api.postUser({ ...user, profileImage: imageName });
      }
    } catch (error) {
      console.error(error);
    }

    // It is all done
    setLoading(false);

    queryClient.invalidateQueries({ queryKey: ["user", "recipe"] });
  };

  // const mutation = useMutation({ mutationFn: () => api.postImage() });

  if (user === null) {
    return <Navigate to={"/login"} />;
  }

  return (
    <Box
      height="100%"
      margin="5%"
      display="flex"
      flexDirection="column"
      alignContent="center"
      flexWrap="wrap"
    >
      <Typography
        variant="h4"
        sx={{ paddingBottom: 2 }}
        justifyContent="center"
      >
        Hi {user.userName}
      </Typography>
      {user.profileImage === undefined ? (
        <AccountCircle
          sx={{
            height: "250px",
            width: "250px",
            fill: stringToColor(user.userName),
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
            alt={user.userName + "'s-username"}
            src={user.profileImage ? api.getImageUrl(user.profileImage) : ""}
          />
        </Box>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", paddingTop: 2 }}>
        <LoadingButton
          loading={loading}
          variant="contained"
          endIcon={<CameraAltIcon />}
          // onClick={() => setLoading(true)}
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
        </LoadingButton>
        {/* )} */}
      </Box>
    </Box>
  );
};
