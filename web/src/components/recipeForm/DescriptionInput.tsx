import {
  Box,
  Button,
  Dialog,
  Fade,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { RecipeInputProps } from "./TitleInput";
import { getApi } from "../../api/Api";
import ReactEmojis from "@souhaildev/reactemojis";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsAiEnabled } from "../../hooks/useIsAiEnabled";

export const DescriptionInput = ({
  value,
  form,
  setForm,
  error,
}: RecipeInputProps) => {
  const queryClient = useQueryClient();
  const api = getApi();
  const [showAnimation, setShowAnimation] = useState(false);
  const { data } = useIsAiEnabled();

  const mutation = useMutation({
    mutationFn: () => {
      if (form?.title === undefined) {
        throw new Error("Not enabled but still trying to query ");
      }

      return api.ai.generateDescriptionAI(form.title);
    },
    mutationKey: ["ai", "generateDescription", form?.title],
    onSuccess: (description) => {
      if (description !== null) {
        setForm((draft) => {
          draft.description = description;
        });

        // Stop the animation
        setShowAnimation(false);
      }
    },
    onError: () => {
      setShowAnimation(false);
    },
  });

  return (
    <>
      {/* <Fade in={showAnimation} timeout={3000}> */}
      <Dialog open={showAnimation}>
        {/* <Box
            sx={{
              display: "flex",
              position: "absolute",
              width: "50%",
              height: "50%",
              justifyContent: "center",
            }}
          > */}
        <img
          alt="Doing magic"
          src={"https://c.tenor.com/z5JHNdc3h5IAAAAC/tenor.gif"}
        />
        {/* </Box> */}
      </Dialog>
      {/* </Fade> */}

      {data === true && form?.title && (
        <Box display="flex" width="100%" justifyContent="flex-end">
          <Button
            onClick={() => {
              setShowAnimation(true);
              queryClient.invalidateQueries({
                queryKey: ["ai", "generateDescription", form?.title],
              });
              // setAiQueryEnabled(true);
              mutation.mutate();
            }}
          >
            ✨Generate✨
          </Button>
        </Box>
      )}
      <Typography variant="h6">Describe your recipe in a few words</Typography>
      <TextField
        value={value}
        placeholder="The worst tasting soup. Passed down from your evil aunt"
        onChange={(event) =>
          setForm((draft) => {
            draft.description = event.target.value ?? "";
          })
        }
        multiline
        variant="standard"
        autoFocus
        error={error}
        helperText={error ? "You need a description..." : undefined}
      />
    </>
  );
};
