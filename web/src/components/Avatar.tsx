import { Avatar as MuiAvatar } from "@mui/material";

export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0].toUpperCase()}`,
  };
}

interface AvatarProps {
  img?: string;
  name: string;
}

export const Avatar = ({ img, name }: AvatarProps) => {
  if (img === undefined) {
    return <MuiAvatar {...stringAvatar(name)} />;
  }

  return <MuiAvatar alt={name} src={img} />;
};
