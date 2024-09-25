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
        onChange={(newValue) => {
          if (newValue === undefined) {
            setForm((draft) => (draft.title = ""));
          } else {
            setForm((draft) => draft.title);
          }
        }}
      />
      <input
        value={form.title}
        onChange={(newValue) => {
          if (newValue === undefined) {
            setForm((draft) => (draft.description = ""));
          } else {
            setForm((draft) => draft.description);
          }
        }}
      />
      <button onClick={() => mutation.mutate()}>Submit</button>
    </div>
  );
};
