import { DraftFunction } from "use-immer";
import { FormValues } from "../../pages/AddRecipePage";
import { Box, Button } from "@mui/material";
import imageCompression from "browser-image-compression";

interface ImageInputProps {
  value: any;
  setForm: (arg: FormValues | DraftFunction<FormValues>) => void;
}

export const ImageInput = ({ value, setForm }: ImageInputProps) => {
  const onChange = async (image: File) => {
    console.log("compressing hopefully");

    console.log(image.name);

    // const imageFile = event.target.files[0];
    console.log("originalFile instanceof Blob", image instanceof Blob); // true
    console.log(`originalFile size ${image.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      type: image.type,
    };

    try {
      const compressedFile = await imageCompression(image, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      console.log(compressedFile.name);
      console.log(compressedFile);

      setForm((draft) => {
        if (compressedFile) {
          draft.image = compressedFile ?? undefined;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {value && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            paddingBottom: 1,
            justifyContent: "center",
          }}
        >
          {/* Display the selected image */}
          <img
            alt="Uploaded img"
            // width={"250px"}
            src={URL.createObjectURL(value)}
            height={"90%"}
            width={"90%"}
          />
          <br /> <br />
          {/* Button to remove the selected image */}
          {/* <button onClick={() => setSelectedImage(null)}>Remove</button> */}
        </Box>
      )}
      <Button variant="contained" component="label">
        Upload File
        <input
          type="file"
          hidden
          onChange={(event) => {
            console.log("..", event?.target?.files?.[0]);
            if (event.target.files && event.target.files[0]) {
              onChange(event.target.files[0]);
            }
          }}
        />
      </Button>
    </>
  );
};
