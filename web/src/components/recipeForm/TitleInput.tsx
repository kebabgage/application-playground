import { TextField, Typography } from "@mui/material";
import { FormValues } from "../../pages/AddRecipePage";
import { DraftFunction } from "use-immer";

export interface RecipeInputProps {
  value: string;
  form?: FormValues;
  setForm: (arg: FormValues | DraftFunction<FormValues>) => void;
}

export const RecipeTitleForm = ({ value, setForm }: RecipeInputProps) => {
  return (
    <>
      <Typography variant="h6">Whats your recipe called? </Typography>
      <TextField
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
      />
    </>
  );
};
