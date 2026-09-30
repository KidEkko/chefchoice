"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckUserCredentials, GetUserWithToken } from "@generic/classes/response";
import { MainPageLoader } from "../useful/loader";
import { PageWrapper } from "../useful/wrap";
import { NavWrapper } from "../nav";
import { DefaultPaths, Paths, PublicRoutes } from "@generic/constants";
import { useHome, useLoading } from "@generic/customHooks";
import { usePathname, useRouter } from "next/navigation";

const UserContext = createContext();

// TODO: convert to TSX
export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ ...props }) {
  const [user, setUser] = useState(null);
  const [tabs, setTabs] = useState([]);
  const { loading: uLoading, stopLoading: uStop } = useLoading(true);
  const { loading: cLoading, startLoading: cStart, stopLoading: cStop } = useLoading(true);
  const { MyHome, newHome, oldHome } = useHome();
  const router = useRouter();
  const path = usePathname();

  const login = useCallback((newUser) => setUser(newUser), []);

  const logout = useCallback(() => {
    oldHome();
    setTabs(DefaultPaths);
    !PublicRoutes.includes(path) && router.push(Paths.HOME);
    setUser(null);
  }, [path, router]);

  const ctx = useMemo(
    () => ({ user, tabs, MyHome, login, logout }),
    [user, tabs, MyHome, login, logout]
  );

  useEffect(() => {
    async function getUser() {
      await GetUserWithToken().then((resp) => {
        resp?.goodResponse() && login(resp.data);
        uStop();
      });
    }

    getUser();
  }, []);

  useEffect(() => {
    async function getCreds() {
      if (!!user) {
        await CheckUserCredentials().then((resp) => {
          resp?.tabs.length && newHome();
          setTabs(resp?.tabs.length ? resp.tabs : DefaultPaths);
        });
      } else if (!uLoading) {
        // TODO: verify this works for non-users
        setTabs(DefaultPaths);
        !PublicRoutes.includes(path) && router.push(Paths.HOME);
      }
      cStop();
    }

    cStart();
    getCreds();
  }, [user]);

  if (uLoading || cLoading)
    return (
      <>
        <NavWrapper />
        <PageWrapper>
          <MainPageLoader />
        </PageWrapper>
      </>
    );


  return <UserContext.Provider value={ctx} {...props} />
}
