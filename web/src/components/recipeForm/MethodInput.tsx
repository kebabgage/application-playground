import { InputAdornment, TextField, Typography } from "@mui/material";
import { FormValues } from "../../pages/AddRecipePage";
import { DraftFunction } from "use-immer";

interface IngredientsInputProps {
  values: string[];
  setForm: (arg: FormValues | DraftFunction<FormValues>) => void;
}

export const MethodInput = ({ values, setForm }: IngredientsInputProps) => {
  return (
    <>
      <Typography variant="h6">
        What steps are involved in making your recipe
      </Typography>
      {values.map((step, index, array) => {
        return (
          <TextField
            value={step}
            placeholder="Lightly grill the skin of the bacon"
            onChange={(event) =>
              setForm((draft) => {
                draft.methodSteps[index] = event.target.value;
              })
            }
            variant="standard"
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                step !== "" &&
                index === array.length - 1
              ) {
                setForm((draft) => {
                  draft.methodSteps.push("");
                });
              }
            }}
            autoFocus={index === array.length - 1}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">{index + 1}.</InputAdornment>
                ),
              },
            }}
          />
        );
      })}
    </>
  );
};
