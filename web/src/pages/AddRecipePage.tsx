import {
  Box,
  Button,
  Input,
  InputAdornment,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { getApi } from "../api/Api";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";

const steps = ["Title", "Description", "Ingredients", "Method", "Image"];

const TOTAL_STEPS = 4;

interface FormValues {
  title: string;
  description: string;
  ingredients: string[];
  methodSteps: string[];
  image?: any;
}

export const AddRecipePage = () => {
  const isSmallScreen = useIsSmallScreen();
  const [cookies] = useCookies(["user"]);
  const queryClient = useQueryClient();
  const api = getApi();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

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
        ingredients: form.ingredients.filter((ingredient) => ingredient !== ""),
        methodSteps: form.methodSteps.filter((ingredient) => ingredient !== ""),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe"] });

      navigate("/");
    },
    mutationKey: ["post", "recipe"],
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          top: 50,
          width: "100%",
          left: 0,
          justifyContent: "center",
        }}
      >
        <Stepper
          sx={{
            width: isSmallScreen ? "default" : "60%",
          }}
          activeStep={step}
          alternativeLabel
        >
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            // if (isStepOptional(index)) {
            //   labelProps.optional = (
            //     <Typography variant="caption">Optional</Typography>
            //   );
            // }
            // if (isStepSkipped(index)) {
            //   stepProps.completed = false;
            // }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      <Box
        width="40%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {/* The title page  */}
        {step === 0 && (
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
        {step === 1 && (
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
        {step === 2 && (
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
        {step === 3 && (
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
                          {index + 1}.
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              );
            })}
          </>
        )}
        {step === 4 && (
          <>
            {form.image && (
              <div>
                {/* Display the selected image */}
                <img
                  alt="not found"
                  width={"250px"}
                  src={URL.createObjectURL(form.image)}
                />
                <br /> <br />
                {/* Button to remove the selected image */}
                {/* <button onClick={() => setSelectedImage(null)}>Remove</button> */}
              </div>
            )}
            <Button variant="contained" component="label">
              Upload File
              <input
                type="file"
                hidden
                onChange={(event) =>
                  setForm((draft) => {
                    if (event.target.files) {
                      draft.image = event?.target?.files[0] ?? undefined;
                    }
                  })
                }
              />
            </Button>
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
          {step !== 0 ? (
            <Button variant="contained" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          ) : (
            <Box></Box>
          )}
          {step < steps.length - 1 ? (
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
