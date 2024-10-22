// import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface User {
  id?: number;
  email?: string;
  userName?: string;
  profileImage?: string;
  lastLoggedIn?: Date;
  firstName?: string;
  lastName?: string;
}

const currentUserAtom = atomWithStorage<Pick<User, "id"> | null>("user", null);
export const useCurrentUser = () => useAtom(currentUserAtom);
