import {
  Box,
  Button,
  Fade,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { RecipeInputProps } from "./TitleInput";
import { getApi } from "../../api/Api";
import ReactEmojis from "@souhaildev/reactemojis";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IconButton } from "rsuite";

export const DescriptionInput = ({
  value,
  form,
  setForm,
}: RecipeInputProps) => {
  const queryClient = useQueryClient();
  const api = getApi();
  const [aiQueryEnabled, setAiQueryEnabled] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const {
    data: generatedDescription,
    isFetched,
    isPending,
  } = useQuery({
    queryFn: () => {
      console.log("Running query");
      if (aiQueryEnabled === false || form?.title === undefined) {
        throw new Error("Not enabled but still trying to query ");
      }

      return api.generateDescriptionAI(form.title);
    },
    queryKey: ["ai", "generateDescription", form?.title],
    enabled: aiQueryEnabled,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (generatedDescription !== undefined && generatedDescription !== null) {
      setForm((draft) => {
        draft.description = generatedDescription;
      });

      // Stop the animation
      setShowAnimation(false);
    }
  }, [generatedDescription, setForm]);

  return (
    <>
      <Fade in={showAnimation} timeout={3000}>
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            width: "50%",
            height: "50%",
            justifyContent: "center",
          }}
        >
          <img
            alt="Doing magic"
            src={"https://c.tenor.com/z5JHNdc3h5IAAAAC/tenor.gif"}
          />
        </Box>
      </Fade>

      {form?.title && (
        <Box display="flex" width="100%" justifyContent="flex-end">
          <Button
            onClick={() => {
              setShowAnimation(true);
              queryClient.invalidateQueries({
                queryKey: ["ai", "generateDescription", form?.title],
              });
              setAiQueryEnabled(true);
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
      />
    </>
  );
};
