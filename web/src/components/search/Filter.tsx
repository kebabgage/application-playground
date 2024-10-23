import { Button, Checkbox, Chip, Menu, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getApi } from "../../api/Api";
import { User } from "../../types/User";

interface FilterProps {
  values: User[];
  onChange: (newValues: User[]) => void;
}

export const Filter = ({ values, onChange }: FilterProps) => {
  const api = getApi();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (userToDelete: User) => {
    onChange(values.filter((value) => value !== userToDelete));
  };

  const handleAdd = (userToAdd: User) => {
    onChange([...values, userToAdd]);
  };

  const { data } = useQuery({
    queryFn: () => api.users.getUsers(),
    queryKey: ["users", "all"],
  });

  return (
    <>
      {/* <Button variant="outlined" onClick={handleClick}>
        Filter by User
      </Button> */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {data?.map((user) => (
          <MenuItem
            onClick={() => {
              if (values.includes(user)) {
                handleDelete(user);
              } else {
                handleAdd(user);
              }
            }}
          >
            <Checkbox
              checked={
                values.find((v) => v.email === user.email) ? true : false
              }
            />
            {user.userName ?? user.email}
          </MenuItem>
        ))}
      </Menu>
      {/* <Box display="flex" flexWrap="wrap" gap={1}> */}
      <Button variant="outlined" onClick={handleClick}>
        Filter by User
      </Button>
      {values.map((value) => (
        <Chip label={value.userName} onDelete={() => handleDelete(value)} />
      ))}
      {/* </Box> */}
    </>
  );
};
