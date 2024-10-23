import {
  Box,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FormValues } from "../../pages/AddRecipePage";
import { DraftFunction } from "use-immer";
import { useEffect, useState } from "react";
import { getListFromParagraph, getParagraphText } from "./IngredientsInput";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";

interface IngredientsInputProps {
  values: string[];
  setForm: (arg: FormValues | DraftFunction<FormValues>) => void;
  error: boolean;
}

export const MethodInput = ({
  values,
  setForm,
  error,
}: IngredientsInputProps) => {
  const [view, setView] = useState<"list" | "paragraph">("list");
  const [paragraph, setParagraph] = useState(getParagraphText(values));

  // Update the actual ingredients list
  useEffect(() => {
    setForm((draft) => {
      draft.methodSteps = getListFromParagraph(paragraph);
    });
  }, [paragraph, setForm]);

  const handleToggle = (newValue: string) => {
    // Generate the correct values
    if (newValue === "list") {
      setForm((draft) => {
        draft.methodSteps = getListFromParagraph(paragraph);
      });

      setView("list");
    } else if (newValue === "paragraph") {
      setParagraph(getParagraphText(values));

      setView("paragraph");
    }
  };

  const input =
    view === "paragraph" ? (
      <TextField
        value={paragraph}
        onChange={(event) => setParagraph(event.target.value)}
        multiline
        variant="standard"
        placeholder={
          "Grill the bacon until its crispy\nPut the bacon back on the pig"
        }
      />
    ) : (
      values.map((ingredient, index, array) => {
        return (
          <TextField
            error={error}
            helperText={error ? "You need at least one step..." : undefined}
            multiline
            key={index}
            value={ingredient}
            placeholder="Grill the bacon until its crispy"
            onChange={(event) =>
              setForm((draft) => {
                draft.methodSteps[index] = event.target.value;
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
                  draft.methodSteps.push("");
                });

                event.preventDefault();
              }
            }}
            autoFocus={index === array.length - 1}
          />
        );
      })
    );

  return (
    <>
      {" "}
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        justifyContent="flex-end"
      >
        <ToggleButtonGroup
          color="secondary"
          value={view}
          exclusive
          onChange={() => {
            handleToggle(view === "paragraph" ? "list" : "paragraph");
          }}
          aria-label="text alignment"
        >
          <ToggleButton value="list" aria-label="left aligned">
            <FormatListBulletedIcon />
          </ToggleButton>
          <ToggleButton value="paragraph" aria-label="centered">
            <FormatAlignCenterIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Typography variant="h6">
        What steps are involved in making your recipe
      </Typography>
      {input}
      {/* {values.map((step, index, array) => {
        return (
          <TextField
            error={error}
            helperText={error ? "You need at least one step..." : undefined}
            key={index}
            multiline
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
                event.preventDefault();
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
      })} */}
    </>
  );
};
