import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { getApi } from "../api/Api";
import { useImmer } from "use-immer";
import { Box, Button, Input, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface FormValues {
  title: string;
  description: string;
}

export const AddRecipe = () => {
  const queryClient = useQueryClient();
  const api = getApi();
  const navigate = useNavigate();

  const [form, setForm] = useImmer<FormValues>({ title: "", description: "" });

  const mutation = useMutation({
    mutationFn: () => {
      return api.postRecipe({
        title: form.title,
        description: form.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe"] });

      // ??
      navigate("/");
    },
    mutationKey: ["post", "recipe"],
  });

  return (
    <Box>
      <TextField
        label="Title"
        value={form.title}
        onChange={(event) => {
          if (event.target.value === undefined) {
            setForm((draft) => {
              draft.title = "";
            });
          } else {
            setForm((draft) => {
              draft.title = event.target.value;
            });
          }
        }}
      />
      <TextField
        label="Description"
        value={form.description}
        onChange={(event) => {
          if (event.target.value === undefined) {
            setForm((draft) => {
              draft.description = "";
            });
          } else {
            setForm((draft) => {
              draft.description = event.target.value;
            });
          }
        }}
      />
      <Button variant="contained" onClick={() => mutation.mutate()}>
        Submit
      </Button>
    </Box>
  );
};
