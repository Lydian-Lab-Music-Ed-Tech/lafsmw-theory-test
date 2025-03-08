import { useState } from 'react';

export const useButtonStates = () => {
  const [isEnterNoteActive, setIsEnterNoteActive] = useState(false);
  const [isEraseNoteActive, setIsEraseNoteActive] = useState(false);
  const [isChangeNoteActive, setIsChangeNoteActive] = useState(false);
  const [isSharpActive, setIsSharpActive] = useState(false);
  const [isFlatActive, setIsFlatActive] = useState(false);
  const [isEraseAccidentalActive, setIsEraseAccidentalActive] = useState(false);

  const clearAllStates = () => {
    setIsEnterNoteActive(false);
    setIsEraseNoteActive(false);
    setIsChangeNoteActive(false);
    setIsSharpActive(false);
    setIsFlatActive(false);
    setIsEraseAccidentalActive(false);
  };

  return {
    states: {
      isEnterNoteActive,
      isEraseNoteActive,
      isChangeNoteActive,
      isSharpActive,
      isFlatActive,
      isEraseAccidentalActive,
    },
    setters: {
      setIsEnterNoteActive,
      setIsEraseNoteActive,
      setIsChangeNoteActive,
      setIsSharpActive,
      setIsFlatActive,
      setIsEraseAccidentalActive,
    },
    clearAllStates,
  };
};
