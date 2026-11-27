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
import { Pantry } from "@/utils/types";
import { GetUserPantry } from "@/lib/actions";
import { useUser } from "./user";


export interface PantryContextType {
  pantry: Pantry | undefined;
  update: (newPantry: Pantry) => void
}

interface PantryProviderProps {
  initialPantry: Pantry | undefined
  children?: ReactNode;
}

const PantryContext = createContext<PantryContextType | undefined>(undefined);

export function usePantry(): PantryContextType {
  const context = useContext(PantryContext);
  if (context === undefined) {
    throw new Error("usePantry must be used within a PantryProvider");
  }
  return context;
}

export function PantryProvider({ initialPantry, children }: PantryProviderProps) {
  const [pantry, setPantry] = useState<Pantry | undefined>(initialPantry);
  const { user } = useUser();

  // Fetch pantry data when user is available
  useEffect(() => {
    if (user) {
      GetUserPantry(user).then(userPantry => {
        if (userPantry) {
          setPantry(userPantry);
        }
      });
    }
  }, [user]);

  const update = useCallback((newPantry: Pantry) => setPantry(newPantry), []);

  const ctx = useMemo<PantryContextType>(
    () => ({ pantry, update }),
    [pantry, update]
  );

  return <PantryContext.Provider value={ctx}>{children}</PantryContext.Provider>;
}