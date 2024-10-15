import { TextField, Typography } from "@mui/material";
import { FormValues } from "../../pages/AddRecipePage";
import { DraftFunction } from "use-immer";

interface IngredientsInputProps {
  values: string[];
  setForm: (arg: FormValues | DraftFunction<FormValues>) => void;
  error: boolean;
}

export const IngredientsInput = ({
  values,
  setForm,
  error,
}: IngredientsInputProps) => {
  return (
    <>
      <Typography variant="h6">What is in your recipe?</Typography>
      {values.map((ingredient, index, array) => {
        return (
          <TextField
            error={error}
            helperText={
              error ? "You need at least one ingredient..." : undefined
            }
            multiline
            key={index}
            value={ingredient}
            placeholder="50 eggs"
            onChange={(event) =>
              setForm((draft) => {
                draft.ingredients[index] = event.target.value;
              })
            }
            variant="standard"
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                ingredient !== "" &&
                index === array.length - 1
              ) {
                setForm((draft) => {
                  draft.ingredients.push("");
                });

                event.preventDefault();
              }
            }}
            autoFocus={index === array.length - 1}
          />
        );
      })}
    </>
  );
};
