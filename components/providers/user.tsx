"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/utils/types"
import { Paths } from "@/serverConfig";


export interface UserContextType {
  user: User | undefined;
  login: (newUser: User) => void;
  logout: () => void;
}

interface UserProviderProps {
  initialUser: User | undefined
  children?: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({ initialUser, children }: UserProviderProps) {
  const [user, setUser] = useState<User | undefined>(initialUser);
  const router = useRouter();
  const path = usePathname() ?? "";

  const login = useCallback((newUser: User) => setUser(newUser), []);

  const logout = useCallback(() => {
    // TODO: Figure out how to prevent issues caused from this
    //if (!PublicRoutes.includes(path)) router.push(Paths.HOME);
    setUser(undefined);
  }, [path, router]);

  const ctx = useMemo<UserContextType>(
    () => ({ user, login, logout }),
    [user, login, logout]
  );

  return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>;
}