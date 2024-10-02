import { DraftFunction } from "use-immer";
import { FormValues } from "../../pages/AddRecipePage";
import { Button } from "@mui/material";

interface ImageInputProps {
  value: any;
  setForm: (arg: FormValues | DraftFunction<FormValues>) => void;
}

export const ImageInput = ({ value, setForm }: ImageInputProps) => {
  return (
    <>
      {value && (
        <div>
          {/* Display the selected image */}
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(value)}
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
  );
};
