import { Dispatch, SetStateAction, useCallback, useState } from 'react';

// Define the legacy button states interface that's expected by existing components
export interface ButtonStates {
  isEnterNoteActive: boolean;
  isEraseNoteActive: boolean;
  isSharpActive: boolean;
  isFlatActive: boolean;
  isEraseAccidentalActive: boolean;
  [key: string]: boolean; // Allow additional properties for extensibility
}

// Define the legacy setters interface
export interface ButtonSetters {
  setIsEnterNoteActive: Dispatch<SetStateAction<boolean>>;
  setIsEraseNoteActive: Dispatch<SetStateAction<boolean>>;
  setIsSharpActive: Dispatch<SetStateAction<boolean>>;
  setIsFlatActive: Dispatch<SetStateAction<boolean>>;
  setIsEraseAccidentalActive: Dispatch<SetStateAction<boolean>>;
  [key: string]: Dispatch<SetStateAction<boolean>>; // Allow additional properties for extensibility
}

// Button state type for the new interface
export type ButtonState = {
  id: string;
  isActive: boolean;
  setter: Dispatch<SetStateAction<boolean>>;
};

/**
 * A custom hook for managing button states in notation components
 * 
 * This implementation fixes the React hooks rules violation by ensuring
 * that all useState calls are at the top level and not inside loops or conditionals.
 */
export const useButtonStates = (initialActiveId?: string) => {
  // Declare each state individually at the top level
  // This ensures hooks are always called in the same order
  const [isEnterNoteActive, setIsEnterNoteActive] = useState(initialActiveId === 'enterNote' || initialActiveId === undefined);
  const [isEraseNoteActive, setIsEraseNoteActive] = useState(initialActiveId === 'eraseNote');
  const [isSharpActive, setIsSharpActive] = useState(initialActiveId === 'sharp');
  const [isFlatActive, setIsFlatActive] = useState(initialActiveId === 'flat');
  const [isEraseAccidentalActive, setIsEraseAccidentalActive] = useState(initialActiveId === 'eraseAccidental');

  // Combine all states into a single object for convenience
  const states: ButtonStates = {
    isEnterNoteActive,
    isEraseNoteActive,
    isSharpActive,
    isFlatActive,
    isEraseAccidentalActive
  };

  // Combine all setters into a single object for convenience
  const setters: ButtonSetters = {
    setIsEnterNoteActive,
    setIsEraseNoteActive,
    setIsSharpActive,
    setIsFlatActive,
    setIsEraseAccidentalActive
  };

  // For the new interface, create an array of button states
  const buttonStates: ButtonState[] = [
    { id: 'enterNote', isActive: isEnterNoteActive, setter: setIsEnterNoteActive },
    { id: 'eraseNote', isActive: isEraseNoteActive, setter: setIsEraseNoteActive },
    { id: 'sharp', isActive: isSharpActive, setter: setIsSharpActive },
    { id: 'flat', isActive: isFlatActive, setter: setIsFlatActive },
    { id: 'eraseAccidental', isActive: isEraseAccidentalActive, setter: setIsEraseAccidentalActive },
  ];

  // Set a specific button as active and deactivate all others
  const setActive = useCallback((buttonId: string) => {
    setIsEnterNoteActive(buttonId === 'enterNote');
    setIsEraseNoteActive(buttonId === 'eraseNote');
    setIsSharpActive(buttonId === 'sharp');
    setIsFlatActive(buttonId === 'flat');
    setIsEraseAccidentalActive(buttonId === 'eraseAccidental');
  }, []);

  // Clear all button states (set all to inactive)
  const clearAllStates = useCallback(() => {
    setIsEnterNoteActive(false);
    setIsEraseNoteActive(false);
    setIsSharpActive(false);
    setIsFlatActive(false);
    setIsEraseAccidentalActive(false);
  }, []);

  return {
    // Legacy interface
    states,
    setters,
    clearAllStates,
    // New interface
    buttonStates,
    setActive
  };
};
