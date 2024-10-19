import { Alert, Box, Button, TextField } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { User, useCurrentUser } from "../hooks/useUser";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getApi } from "../api/Api";

export const LoginPage = () => {
  const navigate = useNavigate();
  const api = getApi();

  const [user, setUser] = useCurrentUser();
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
    onSuccess: (response) => {
      navigate("/");

      setUser(form);
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

  if (user !== null) {
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
