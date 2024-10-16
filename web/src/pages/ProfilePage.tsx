import AccountCircle from "@mui/icons-material/AccountCircle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import imageCompression from "browser-image-compression";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { getApi } from "../api/Api";
import { stringToColor } from "../components/Avatar";
import { useCurrentUser } from "../hooks/useUser";
import { LoadingButton } from "@mui/lab";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetUser } from "../hooks/useGetUser";

export const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useCurrentUser();
  const { data: user, isLoading } = useGetUser(currentUser?.email);

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const api = getApi();
  const [newImage, setNewImage] = useState<Blob>();
  // const [image, setImage] = useState<Blob>();
  const [imageName, setImageName] = useState();

  const { mutate } = useMutation({
    mutationFn: (image2: Blob | undefined) => {
      if (image2 === undefined) {
        console.log("sorry! Image is not defined");
      }
      return api.postImage(image2);

      console.log("mutation1", newImage);
      // console.log(imageName);
    },
    onSuccess: (response) => {
      console.log(response);
      console.log(api.getImageUrl(response));
      mutate2(response);
    },
  });

  const { mutate: mutate2 } = useMutation({
    mutationFn: (imageUrl: string) => {
      if (user === undefined) {
        throw new Error("Error with the updating of your user sorry!");
      }
      // if (user !== null && user?.email !== undefined) {
      return api.postUser({ ...user, profileImage: imageUrl });
      // }

      // try {
      // if (currentUser !== null) {
      //   setCurrentUser({
      //     // userName: user?.userName,
      //     email: currentUser.email,
      //     // profileImage: imageName,
      //   });
      // console.log(imageName);
      // }
      // } catch (error) {
      //   console.error(error);
      // }
    },
    onSuccess: () => {
      // Refresh the user
      queryClient.invalidateQueries({ queryKey: ["user"] });

      setLoading(false);
    },
  });

  /**
   * Sets the image
   */
  const onChange = async (image: File) => {
    setLoading(true);
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      type: image.type,
    };

    try {
      const compressedFile = await imageCompression(image, options);
      setNewImage(compressedFile);

      mutate(compressedFile);
    } catch (error) {
      throw new Error("Error in compressing image :/");
    }
  };

  if (currentUser === null) {
    return <Navigate to={"/login"} />;
  }

  if (user === undefined || isLoading) {
    return <CircularProgress />;
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
      {!user.profileImage ? (
        <AccountCircle
          sx={{
            height: "250px",
            width: "250px",
            fill: stringToColor(user?.userName ?? "?"),
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
            src={
              newImage !== undefined
                ? URL.createObjectURL(newImage)
                : user.profileImage
                ? api.getImageUrl(user.profileImage)
                : ""
            }
          />
        </Box>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", paddingTop: 2 }}>
        <LoadingButton
          loading={loading}
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
        </LoadingButton>
      </Box>
    </Box>
  );
};
