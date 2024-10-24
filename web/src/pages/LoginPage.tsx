import { Alert, Box, Button, TextField } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getApi } from "../api/Api";
import { User } from "../types/User";

export const LoginPage = () => {
  const navigate = useNavigate();
  const api = getApi();

  const [currentUser, setCurrentUser] = useCurrentUser();
  const [form, setForm] = useImmer<User>({
    userName: "",
    email: "",
  });

  const [emailValid, setEmailValid] = useState(true);

  const mutation = useMutation({
    mutationFn: () => {
      if (form === null) {
        throw new Error("User cannot be null here ");
      }

      return api.users.postUser({ userName: form.userName, email: form.email });
    },
    onSuccess: (loggedInUser: User) => {
      console.log(loggedInUser);
      if (loggedInUser.id) {
        setCurrentUser({ id: loggedInUser.id });
      }

      navigate("/");
    },
  });

  const handleSubmit = async () => {
    if (form.email === "") {
      setEmailValid(false);
      return;
    }

    // Log with the api that the user logged in
    mutation.mutate();

    // setUser(form);

    // navigate("/");
  };

  if (currentUser !== null && currentUser.id !== undefined) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Box sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
        <TextField
          label="Username"
          value={form.userName}
          onChange={(event) => {
            setForm((draft) => {
              draft.userName = event.target.value ?? "";
            });
          }}
          variant="standard"
        />
        <TextField
          error={!emailValid}
          label="Email"
          value={form.email}
          onChange={(event) => {
            setForm((draft) => {
              draft.email = event.target.value ?? "";
            });
          }}
          variant="standard"
        />
      </Box>
      <Box paddingTop={5}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </>
  );
};
