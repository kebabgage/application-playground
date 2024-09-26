import {
  Box,
  Button,
  Input,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { getApi } from "../api/Api";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";

const TOTAL_STEPS = 4;

interface FormValues {
  title: string;
  description: string;
  ingredients: string[];
  methodSteps: string[];
}

export const AddRecipePage = () => {
  const [cookies] = useCookies(["user"]);
  const queryClient = useQueryClient();
  const api = getApi();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useImmer<FormValues>({
    title: "",
    description: "",
    ingredients: [""],
    methodSteps: [""],
  });

  const mutation = useMutation({
    mutationFn: () => {
      return api.postRecipe({
        title: form.title,
        description: form.description,
        username: cookies["user"].username,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe"] });

      // ??
      navigate("/");
    },
    mutationKey: ["post", "recipe"],
  });

  console.log(form.ingredients);

  return (
    <>
      <Box
        width="40%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {/* The title page  */}
        {step === 1 && (
          <>
            <Typography>Whats your recipe called? </Typography>
            <TextField
              value={form.title}
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
        )}
        {/* The description page  */}
        {step === 2 && (
          <>
            <Typography>Describe your recipe in a few words</Typography>
            <TextField
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
        )}
        {/* The ingredients page  */}
        {step === 3 && (
          <>
            <Typography>What is in your recipe?</Typography>
            {form.ingredients.map((ingredient, index, array) => {
              return (
                <TextField
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
                    }
                  }}
                  autoFocus={index === array.length - 1}
                />
              );
            })}
          </>
        )}
        {/* The method page  */}
        {step === 4 && (
          <>
            <Typography>
              What steps are involved in making your recipe
            </Typography>
            {form.methodSteps.map((step, index, array) => {
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
                        <InputAdornment position="start">
                          {index + 1}
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              );
            })}
          </>
        )}
        <Box
          sx={{
            paddingTop: 5,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {step !== 1 ? (
            <Button variant="contained" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          ) : (
            <Box></Box>
          )}
          {step !== TOTAL_STEPS ? (
            <Button variant="contained" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={() => mutation.mutate()}>
              Submit
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};
