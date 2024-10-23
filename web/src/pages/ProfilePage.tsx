import AccountCircle from "@mui/icons-material/AccountCircle";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { LoadingButton } from "@mui/lab";
import { Box, CircularProgress, Input, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
import { useState } from "react";
import { getApi } from "../api/Api";
import { stringToColor } from "../components/Avatar";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useGetUser } from "../hooks/useGetUser";
import { SubHeading } from "./util/PageHeading";
import { PageWrapper } from "./util/PageWrapper";
import { User } from "../types/User";

const getUserAttribute = (
  userId: number,
  attribute: string,
  value?: string
): Partial<User> => {
  const user: Partial<User> = { id: userId };

  switch (attribute) {
    case "Email":
      return { email: value, ...user };
    case "First Name":
      return { firstName: value, ...user };
    case "Last Name":
      return { lastName: value, ...user };
    case "Username":
      return { userName: value, ...user };
    default:
      throw new Error("We can't handle this...");
  }
};

interface AttributeFormProps {
  attribute: string;
  initialValue?: string;
  setLoading: (loading: boolean) => void;
}

const AttributeForm = ({
  attribute,
  initialValue,
  setLoading,
}: AttributeFormProps) => {
  const [currentUser, setCurrentUser] = useCurrentUser();
  const { data: user } = useGetUser(currentUser?.id);
  const queryClient = useQueryClient();

  const [currentValue, setCurrentValue] = useState(initialValue);
  const api = getApi();

  const { mutate } = useMutation({
    mutationFn: () => {
      setLoading(true);
      console.log("called");
      if (user?.id === undefined || user?.id === null) {
        throw new Error("Can't update user without id...");
      }

      const request = getUserAttribute(user.id, attribute, currentValue);

      if (request === null) {
        throw new Error("The field is not mapped properly");
      }

      return api.users.updateUser(request);
    },
    onSuccess: (user) => {
      console.log(user);
      setCurrentUser(user);

      queryClient.invalidateQueries({ queryKey: ["user"] });

      setLoading(false);
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 3,
        alignItems: "center",
      }}
    >
      <Typography width="30%" fontWeight="bold">
        {attribute}
      </Typography>
      <Input
        value={currentValue || ""}
        onChange={(event) => setCurrentValue(event.target.value)}
        onBlur={() => (initialValue === currentValue ? undefined : mutate())}
      />
    </Box>
  );
};

export const ProfilePage = () => {
  const [currentUser] = useCurrentUser();
  const { data: user, isLoading } = useGetUser(currentUser?.id);

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [valuesLoading, setValuesLoading] = useState(false);

  const api = getApi();
  const [newImage, setNewImage] = useState<Blob>();

  const { mutate } = useMutation({
    mutationFn: (image2: Blob | undefined) => {
      if (image2 === undefined) {
        console.error("sorry! Image is not defined");
      }
      return api.images.postImage(image2);
    },
    onSuccess: (response) => {
      mutate2(response);
    },
  });

  const { mutate: mutate2 } = useMutation({
    mutationFn: (imageUrl: string) => {
      if (user === undefined) {
        throw new Error("Error with the updating of your user sorry!");
      }

      return api.users.postUser({ ...user, profileImage: imageUrl });
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

  if (user === undefined || isLoading) {
    return <CircularProgress />;
  }

  console.log(user);

  if (currentUser === null || currentUser.id === undefined) {
    // return <Navigate to={"/login"} />;
  }

  return (
    <PageWrapper>
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
                ? api.images.getImageUrl(user.profileImage)
                : undefined
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <SubHeading>About You </SubHeading>
          {valuesLoading && <CircularProgress size="1.25rem" />}
        </Box>
        <AttributeForm
          attribute="Username"
          initialValue={user.userName}
          setLoading={setValuesLoading}
        />
        <AttributeForm
          attribute="First Name"
          initialValue={user.firstName}
          setLoading={setValuesLoading}
        />
        <AttributeForm
          attribute="Last Name"
          initialValue={user.lastName}
          setLoading={setValuesLoading}
        />
        <AttributeForm
          attribute="Email"
          initialValue={user.email}
          setLoading={setValuesLoading}
        />
      </Box>
    </PageWrapper>
  );
};
