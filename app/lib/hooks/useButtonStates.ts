import { useCallback, useState } from "react";
import { ButtonStates, ButtonSetters } from "../types";

export const useButtonStates = (initialActiveId?: string) => {
  // Declare at top to ensure hooks are always called in the same order
  const [isEnterNoteActive, setIsEnterNoteActive] = useState(
    initialActiveId === "enterNote" || initialActiveId === undefined
  );
  const [isEraseNoteActive, setIsEraseNoteActive] = useState(
    initialActiveId === "eraseNote"
  );
  const [isSharpActive, setIsSharpActive] = useState(
    initialActiveId === "sharp"
  );
  const [isFlatActive, setIsFlatActive] = useState(initialActiveId === "flat");
  const [isEraseAccidentalActive, setIsEraseAccidentalActive] = useState(
    initialActiveId === "eraseAccidental"
  );

  const states: ButtonStates = {
    isEnterNoteActive,
    isEraseNoteActive,
    isSharpActive,
    isFlatActive,
    isEraseAccidentalActive,
  };

  const setters: ButtonSetters = {
    setIsEnterNoteActive,
    setIsEraseNoteActive,
    setIsSharpActive,
    setIsFlatActive,
    setIsEraseAccidentalActive,
  };

  const clearAllStates = useCallback(() => {
    setIsEnterNoteActive(false);
    setIsEraseNoteActive(false);
    setIsSharpActive(false);
    setIsFlatActive(false);
    setIsEraseAccidentalActive(false);
  }, []);

  return {
    states,
    setters,
    clearAllStates,
  };
};
