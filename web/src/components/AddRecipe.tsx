import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { getApi } from "../api/Api";
import { useImmer } from "use-immer";

interface FormValues {
  title: string;
  description: string;
}

export const AddRecipe = () => {
  const queryClient = useQueryClient();
  const api = getApi();

  const [form, setForm] = useImmer<FormValues>({ title: "", description: "" });

  const mutation = useMutation({
    mutationFn: () => {
      return api.postRecipe({
        title: form.title,
        description: form.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe"] });
    },
    mutationKey: ["post", "recipe"],
  });

  return (
    <div>
      <input
        value={form.title}
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
      />
      <input
        value={form.description}
        onChange={(event) => {
          if (event.target.value === undefined) {
            setForm((draft) => {
              draft.description = "";
            });
          } else {
            setForm((draft) => {
              draft.description = event.target.value;
            });
          }
        }}
      />
      <button onClick={() => mutation.mutate()}>Submit</button>
    </div>
  );
};
