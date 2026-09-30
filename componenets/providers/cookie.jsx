"use client";

import {createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CookieString, Seconds } from "@generic/constants";
import { MidnightUTC, TimeToMidnightUTC } from "@lib/utils";
import { PseudoRng } from "@generic/classes/rng";
import { useCookies } from "react-cookie";
import { readableCookie } from "@generic/functions";

// TODO: convert to TSX
const CookieContext = createContext();

export function useCookie() {
  return useContext(CookieContext);
}

export function CookieProvider({ ...props }) {
  const [cookie, setCookie] = useCookies([CookieString.UserToken, CookieString.Settings, CookieString.MathData, CookieString.MathRules]);

  // Load ldrs stuff
  // eventually will move this
  useEffect(() => {
    async function loadLoaders() {
      const { reuleaux, grid, helix } = await import("ldrs");
      reuleaux.register();
      grid.register();
      helix.register();
    }

    loadLoaders();
  }, []);

  useEffect(() => {
    const mathData = getCookie(CookieString.MathData);
    !!mathData && setData([...baseData, ...mathData]);
  }, []);

  const getCookie = useCallback((name) => {
    return cookie[name];
  }, [cookie])

  const updateCookie = useCallback((cookie) => {
    setCookie(cookie.name, cookie.data, readableCookie(cookie.age));
  }, [])

  const addMathData = useCallback(
    (submission) => {
      const newData = [...mathData, submission];
      setData(newData);
      updateCookie({
        name: CookieString.MathData,
        data: newData.filter((data) => !baseData.includes(data)),
        age: TimeToMidnightUTC(),
      });
    },
    [mathData]
  );

  const updateSettings = useCallback((settings) => {
    updateCookie({
      name: CookieString.Settings,
      data: settings,
      age: Seconds.Year,
    });
  }, []);

  const settings = useCallback(() => {
    return getCookie(CookieString.Settings);
  });

  const ctx = useMemo( () => ({ getCookie, updateCookie, settings, mathData, updateSettings, addMathData }),
    [getCookie, updateCookie, settings, mathData, updateSettings, addMathData]
  );

  return <CookieContext.Provider value={ctx} {...props} />
}
