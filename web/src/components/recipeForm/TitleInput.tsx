import { TextField, Typography } from "@mui/material";
import { FormErrorValues, FormValues } from "../../pages/AddRecipePage";
import { DraftFunction } from "use-immer";

export interface RecipeInputProps {
  value: string;
  form?: FormValues;
  setForm: (arg: FormValues | DraftFunction<FormValues>) => void;
  error: boolean;
  // setError: DraftFunction<ErrorValues>;
}

export const RecipeTitleForm = ({
  value,
  setForm,
  error,
}: RecipeInputProps) => {
  return (
    <>
      <Typography variant="h6">Whats your recipe called? </Typography>
      <TextField
        error={error}
        value={value}
        placeholder="Yummy little bummy"
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
        variant="standard"
        autoFocus
        helperText={error ? "You need a title..." : undefined}
      />
    </>
  );
};
