"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { GetUserWithToken } from "@util/classes/response";
import { Paths, PublicRoutes } from "@util/constants";
import { useLoading } from "@util/customHooks";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@util/classes/user"


export interface UserContextType {
  user: User | null;
  login: (newUser: User) => void;
  logout: () => void;
}

interface UserProviderProps {
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

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const { loading: uLoading, stopLoading: uStop } = useLoading(true);
  const router = useRouter();
  const path = usePathname() ?? "";

  const login = useCallback((newUser: User) => setUser(newUser), []);


  const logout = useCallback(() => {
    // oldHome(); update this

    if (!PublicRoutes.includes(path)) router.push(Paths.HOME);
    setUser(null);
  }, [path, router]);

  const ctx = useMemo<UserContextType>(
    () => ({ user, login, logout }),
    [user, login, logout]
  );

  useEffect(() => {
    async function getUser() {
      const resp = await GetUserWithToken();
      if (resp?.goodResponse()) login(resp.data);
      uStop();
    }

    getUser();
  }, []);

  if (uLoading) {
    // TODO: Design default skeleton look for pages to display while loading.
    // there may be a better way to do this
    
    return (
      <>
      <p>Hello World</p>
      </>
    );
  }

  return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>;
}