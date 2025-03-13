"use client";
import { createContext, useContext, useState } from "react";
import { ClefProviderProps } from "../lib/types";

const ClefContext = createContext<
  | {
      chosenClef: string;
      setChosenClef: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined
>(undefined);

export const ClefProvider = ({ children }: ClefProviderProps) => {
  const [chosenClef, setChosenClef] = useState<string>("treble");

  return (
    <ClefContext.Provider
      value={{ chosenClef: chosenClef, setChosenClef: setChosenClef }}
    >
      {children}
    </ClefContext.Provider>
  );
};

export const useClef = () => {
  const context = useContext(ClefContext);
  if (context === undefined) {
    throw new Error("useClef must be used within a ClefProvider");
  }
  return context;
};
