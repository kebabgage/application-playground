import { Button, TextField } from "@mui/material";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";

export const LoginPage = () => {
  const navigate = useNavigate();

  const [cookies, setCookies] = useCookies(["user"]);
  const [form, setForm] = useImmer({
    username: "",
    email: "",
  });

  const handleSubmit = () => {
    setCookies("user", form, { path: "/" });

    navigate("/");
  };

  return (
    <>
      <TextField
        label="Username"
        value={form.username}
        onChange={(event) => {
          setForm((draft) => {
            draft.username = event.target.value ?? "";
          });
        }}
      />
      <TextField
        label="Email"
        value={form.email}
        onChange={(event) => {
          setForm((draft) => {
            draft.email = event.target.value ?? "";
          });
        }}
      />

      <Button variant="contained" onClick={() => handleSubmit()}>
        Submit
      </Button>
    </>
  );
};
