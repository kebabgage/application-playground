import { Typography } from "@mui/material";
import { Highlighted } from "./Highlighted";

interface IngredientsContainsProps {
  listName: "Method" | "Ingredients";

  searchValue?: string;
  ingredients: string[];
  limit: number;
}

export const ListContains = ({
  searchValue,
  ingredients: values,
  listName,
  limit,
}: IngredientsContainsProps) => {
  if (searchValue === undefined) {
    return null;
  }
  let containsList = values.filter((i) => i.includes(searchValue));
  if (containsList.length === 0) {
    return null;
  }

  if (listName === "Method") {
    // Reduce the amount of values
    containsList = containsList.map((item) => {
      return item
        .split(" ")
        .map((value, index, array) => {
          if (value.includes(searchValue)) {
            return `...${array[index - 1] ?? ""} ${value} ${
              array[index + 1] ?? ""
            }`;
          }

          return undefined;
        })
        .filter((i) => i !== undefined)
        .join(" ");
    });
  }

  return (
    <Typography>
      <Typography fontWeight="bold">{listName} contains: </Typography>
      {containsList.slice(0, limit).map((c, index, array) => (
        <>
          <Highlighted text={c} highlight={searchValue} />
          {index === array.length - 1 ? "" : ", "}
        </>
      ))}
    </Typography>
  );
};
