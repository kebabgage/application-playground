import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FormValues } from "../../pages/AddRecipePage";
import { DraftFunction } from "use-immer";
import { useEffect, useState } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";

const getParagraphText = (values: string[]) => {
  if (values.length === 0) {
    return "";
  }
  return values.join("\n");
};

const getListFromParagraph = (paragraph: string) => {
  return paragraph.split("\n");
};

interface IngredientsInputProps {
  values: string[];
  setForm: (arg: FormValues | DraftFunction<FormValues>) => void;
  error: boolean;
  convertValues?: () => void;
}

export const IngredientsInput = ({
  values,
  setForm,
  error,
}: IngredientsInputProps) => {
  const [view, setView] = useState<"list" | "paragraph">("list");
  const [paragraph, setParagraph] = useState(getParagraphText(values));

  // Update the actual ingredients list
  useEffect(() => {
    setForm((draft) => {
      draft.ingredients = getListFromParagraph(paragraph);
    });
  }, [paragraph, setForm]);

  const handleToggle = (newValue: string) => {
    // Generate the correct values
    if (newValue === "list") {
      setForm((draft) => {
        draft.ingredients = getListFromParagraph(paragraph);
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
      />
    ) : (
      values.map((ingredient, index, array) => {
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
      })
    );

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        justifyContent="flex-end"
      >
        {/* <FormControlLabel
          control={
            <Switch
              value={view}
              onChange={() => {
                handleToggle(view === "paragraph" ? "list" : "paragraph");
              }}
              color="secondary"
            />
          }
          label="Paragraph View"
        /> */}
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
      <Typography variant="h6">What is in your recipe?</Typography>
      {input}
    </>
  );
};
