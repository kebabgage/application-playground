// import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface User {
  email: string;
  userName?: string;
  profileImage?: string;
  lastLoggedIn?: Date;
}

const currentUserAtom = atomWithStorage<Pick<User, "email"> | null>(
  "user",
  null
);
export const useCurrentUser = () => useAtom(currentUserAtom);
