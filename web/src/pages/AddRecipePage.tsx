import {
  Box,
  Button,
  LinearProgress,
  Slide,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { getApi } from "../api/Api";
import { DescriptionInput } from "../components/recipeForm/DescriptionInput";
import { ImageInput } from "../components/recipeForm/ImageInput";
import { IngredientsInput } from "../components/recipeForm/IngredientsInput";
import { MethodInput } from "../components/recipeForm/MethodInput";
import { RecipeTitleForm } from "../components/recipeForm/TitleInput";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { useCurrentUser } from "../hooks/useUser";
import { useGetUser } from "../hooks/useGetUser";

const steps = ["Title", "Description", "Ingredients", "Method", "Image"];

export interface FormValues {
  title: string;
  description: string;
  ingredients: string[];
  methodSteps: string[];
  image?: any;
}

export interface FormErrorValues {
  title: boolean;
  description: boolean;
  ingredients: boolean;
  method: boolean;
}

export const AddRecipePage = () => {
  const isSmallScreen = useIsSmallScreen();
  const [currentUser, setUser] = useCurrentUser();
  const { data: user } = useGetUser(currentUser?.email);

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

  const [error, setError] = useImmer<FormErrorValues>({
    title: false,
    description: false,
    ingredients: false,
    method: false,
  });

  const validate = (newStepNumber: number) => {
    const ingredientsEmpties = form.ingredients.filter((i) => i !== "").length;

    switch (newStepNumber) {
      /**
       * Title page
       */
      case 1:
        setError((draft) => {
          draft.title = form.title === "";
        });
        return form.title !== "";

      /**
       * Description page
       */
      case 2:
        setError((draft) => {
          draft.title = form.title === "";
          draft.description = form.description === "";
        });
        return form.description !== "";

      /**
       * Ingredients page
       */
      case 3:
        const amountOfNonEmpties = form.ingredients.filter(
          (i) => i !== ""
        ).length;
        setError((draft) => {
          draft.title = form.title === "";
          draft.description = form.description === "";
          draft.ingredients = amountOfNonEmpties === 0;
        });

        return amountOfNonEmpties !== 0;

      /**
       * Method page
       */
      case 4:
        const methodNonEmpty = form.methodSteps.filter((i) => i !== "");
        setError((draft) => {
          draft.title = form.title === "";
          draft.description = form.description === "";
          draft.ingredients = ingredientsEmpties === 0;
          draft.method = methodNonEmpty.length === 0;
        });

        return methodNonEmpty.length !== 0;
    }
  };

  const handleNextStep = (newStepNumber: number) => {
    console.log(form);
    // Check validation
    const formValid = validate(newStepNumber);

    //
    if (formValid) {
      setStep(newStepNumber);
    }
  };

  const postImageMutation = useMutation({
    mutationFn: () => {
      return api.images.postImage(form.image);
    },
    onSuccess: (data) => {
      // Make the progress bar do a little thing
      setTimeout(() => setSubmitState(100), 2);

      mutate(data);
    },
    mutationKey: ["post", "image"],
  });

  const { mutate, isError, isPending } = useMutation({
    mutationFn: (imageUrl: string) => {
      if (user === null || user === undefined) {
        throw new Error("User needs to be not null");
      }
      return api.recipes.postRecipe({
        title: form.title,
        description: form.description,
        username: user?.userName,
        ingredients: form.ingredients.filter((ingredient) => ingredient !== ""),
        methodSteps: form.methodSteps.filter((ingredient) => ingredient !== ""),
        imageUrl: imageUrl,
        user: user,
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
        height="60%"
        width="80%"
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
            <Typography variant="body1" paddingBottom={2}>
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        // top: 50,
        // width: "100%",
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          position: "relative",
          top: 20,
          // width: "100%",
          // left: 0,
          justifyContent: "center",
          alignSelf: "flex-start",
        }}
      >
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};

            return (
              <Step sx={{ width: "65px" }} key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      <Box
        width={"90%"}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        flexGrow={1}
      >
        {/* The title page  */}
        {step === 0 && (
          <RecipeTitleForm
            value={form.title}
            setForm={setForm}
            error={error.title}
          />
        )}
        {/* The description page  */}
        {step === 1 && (
          <DescriptionInput
            value={form.description}
            setForm={setForm}
            form={form}
            error={error.description}
          />
        )}
        {/* The ingredients page  */}
        {step === 2 && (
          <IngredientsInput
            values={form.ingredients}
            setForm={setForm}
            error={error.ingredients}
          />
        )}
        {/* The method page  */}
        {step === 3 && (
          <MethodInput
            values={form.methodSteps}
            setForm={setForm}
            error={error.method}
          />
        )}
        {step === 4 && <ImageInput value={form.image} setForm={setForm} />}
        {step === 5 && (
          <>
            <Typography>
              {postImageMutation.isPending ? "Image posting" : "Done"}
            </Typography>
            <Typography>{isPending ? "Recipe posting" : "Done"}</Typography>
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
            <Button variant="outlined" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          ) : (
            <Box></Box>
          )}
          {step < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => handleNextStep(step + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                // Set the loading state
                setSubmitState(0);

                if (form.image === undefined) {
                  mutate("");
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
    </Box>
  );
};
