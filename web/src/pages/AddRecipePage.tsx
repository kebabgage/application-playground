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
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { getApi } from "../api/Api";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { RecipeTitleForm } from "../components/recipeForm/TitleInput";
import { DescriptionInput } from "../components/recipeForm/DescriptionInput";
import { IngredientsInput } from "../components/recipeForm/IngredientsInput";
import { MethodInput } from "../components/recipeForm/MethodInput";
import { ImageInput } from "../components/recipeForm/ImageInput";

const steps = ["Title", "Description", "Ingredients", "Method", "Image"];

export interface FormValues {
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
  const [recipeId, setRecipeId] = useState<number | null>();

  const [submitState, setSubmitState] = useState<number | null>(null);

  const [form, setForm] = useImmer<FormValues>({
    title: "",
    description: "",
    ingredients: [""],
    methodSteps: [""],
  });

  console.log(form);

  const postImageMutation = useMutation({
    mutationFn: () => {
      return api.postImage(form.image);
    },
    onSuccess: (data) => {
      console.log("Image created", data);

      // Make the progress bar do a little thing
      setTimeout(() => setSubmitState(100), 2);

      mutation.mutate(data);
    },
    mutationKey: ["post", "image"],
  });

  const mutation = useMutation({
    mutationFn: (imageUrl: string) => {
      return api.postRecipe({
        title: form.title,
        description: form.description,
        username: cookies["user"].username,
        ingredients: form.ingredients.filter((ingredient) => ingredient !== ""),
        methodSteps: form.methodSteps.filter((ingredient) => ingredient !== ""),
        imageUrl: imageUrl,
      });
    },
    onSuccess: (recipe) => {
      queryClient.invalidateQueries({ queryKey: ["recipe"] });

      setTimeout(() => setSubmitState(100), 2);

      setRecipeId(recipe.id ?? undefined);
    },
    mutationKey: ["post", "recipe"],
  });

  if (submitState !== null) {
    return (
      <Box
        width="40%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {submitState === 100 && (
          <Box
            paddingBottom={2}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography variant="h4">Recipe Uploaded</Typography>
            <Typography variant="body1">
              Great work! Everyone can now see your recipe.
            </Typography>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                justifySelf: "center",
                paddingTop: 4,
              }}
            >
              <Button onClick={() => navigate("/")}>Home</Button>
              <Button onClick={() => navigate("/recipe?id=" + recipeId)}>
                View Recipe
              </Button>
            </Box>
          </Box>
        )}
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={submitState} />
        </Box>
      </Box>
    );
  }

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

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      <Box
        width={isSmallScreen ? "90%" : "40%"}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {/* The title page  */}
        {step === 0 && <RecipeTitleForm value={form.title} setForm={setForm} />}
        {/* The description page  */}
        {step === 1 && (
          <DescriptionInput
            value={form.description}
            setForm={setForm}
            form={form}
          />
        )}
        {/* The ingredients page  */}
        {step === 2 && (
          <IngredientsInput values={form.ingredients} setForm={setForm} />
        )}
        {/* The method page  */}
        {step === 3 && (
          <MethodInput values={form.methodSteps} setForm={setForm} />
        )}
        {step === 4 && <ImageInput value={form.image} setForm={setForm} />}
        {step === 5 && (
          <>
            <Typography>
              {postImageMutation.isPending ? "Image posting" : "Done"}
            </Typography>
            <Typography>
              {mutation.isPending ? "Recipe posting" : "Done"}
            </Typography>
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
            <Button
              variant="contained"
              onClick={() => {
                // Set the loading state
                setSubmitState(0);

                if (form.image === undefined) {
                  mutation.mutate("");
                } else {
                  // Make the post image call
                  postImageMutation.mutate();
                }
              }}
            >
              Submit
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};
