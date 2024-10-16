import { Badge, Avatar as MuiAvatar, styled, Tooltip } from "@mui/material";
import { differenceInMinutes, formatDistanceToNow } from "date-fns";
import { User } from "../hooks/useUser";
import { userInfo } from "os";
import { getApi } from "../api/Api";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));
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
  user: User;
  size?: "medium" | "regular" | "large";
}

export const Avatar = ({ user, size }: AvatarProps) => {
  const api = getApi();

  // Extract the values from user that we want
  const name = user.userName;
  const img = user.profileImage
    ? api.getImageUrl(user.profileImage)
    : undefined;

  const isBadgeVisible =
    user.lastLoggedIn !== undefined && size !== "large"
      ? differenceInMinutes(new Date(), user.lastLoggedIn) <= 1
      : false;

  let title = "";
  title += name;

  if (user.lastLoggedIn !== undefined) {
    if (isBadgeVisible) {
      title += " - Active now";
    } else {
      title += ` - Last active ${formatDistanceToNow(user.lastLoggedIn)} ago`;
    }
  }

  const sxOverride =
    size === "large"
      ? { height: "150px", width: "150px" }
      : size === "medium"
      ? { height: "50px", width: "50px" }
      : undefined;

  if (img === undefined) {
    return (
      <Tooltip title={title}>
        <StyledBadge
          invisible={!isBadgeVisible}
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <MuiAvatar {...stringAvatar(name ?? "?")} />
        </StyledBadge>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={title}>
      <StyledBadge
        invisible={!isBadgeVisible}
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
      >
        <MuiAvatar sx={{ ...sxOverride }} alt={name} src={img} />
      </StyledBadge>
    </Tooltip>
  );
};
