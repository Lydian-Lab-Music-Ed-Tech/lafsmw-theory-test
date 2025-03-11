import { Dispatch, SetStateAction, useCallback, useState } from 'react';

// Define the legacy button states interface that's expected by existing components
export interface ButtonStates {
  isEnterNoteActive: boolean;
  isEraseNoteActive: boolean;
  isChangeNoteActive: boolean;
  isSharpActive: boolean;
  isFlatActive: boolean;
  isEraseAccidentalActive: boolean;
  [key: string]: boolean; // Allow additional properties for extensibility
}

// Define the legacy setters interface
export interface ButtonSetters {
  setIsEnterNoteActive: Dispatch<SetStateAction<boolean>>;
  setIsEraseNoteActive: Dispatch<SetStateAction<boolean>>;
  setIsChangeNoteActive: Dispatch<SetStateAction<boolean>>;
  setIsSharpActive: Dispatch<SetStateAction<boolean>>;
  setIsFlatActive: Dispatch<SetStateAction<boolean>>;
  setIsEraseAccidentalActive: Dispatch<SetStateAction<boolean>>;
  [key: string]: Dispatch<SetStateAction<boolean>>; // Allow additional properties for extensibility
}

// New expanded button state type
export type ButtonState = {
  id: string;
  isActive: boolean;
  setter: Dispatch<SetStateAction<boolean>>;
};

type ButtonStateConfig = string[];

/**
 * A more flexible hook for managing button states in notation components
 * 
 * @param buttonIds - Array of button state IDs to initialize
 * @param initialActiveId - Optional ID of the initially active button
 * @returns Button states, setActive utility function, and clearAll utility function
 */
export const useButtonStates = (buttonIds: ButtonStateConfig = [
  'enterNote',
  'eraseNote',
  'changeNote',
  'sharp',
  'flat',
  'eraseAccidental'
], initialActiveId?: string) => {
  // Create state for each button
  const buttonStates = buttonIds.map(id => {
    const [isActive, setIsActive] = useState(id === initialActiveId);
    return { id, isActive, setter: setIsActive };
  });

  // Default values for the legacy interface, ensuring type compatibility
  const defaultStates: ButtonStates = {
    isEnterNoteActive: false,
    isEraseNoteActive: false,
    isChangeNoteActive: false,
    isSharpActive: false,
    isFlatActive: false,
    isEraseAccidentalActive: false,
  };
  
  // Initialize with default values first
  const statesMap = { ...defaultStates };
  const settersMap: ButtonSetters = {
    setIsEnterNoteActive: () => {}, // Will be overridden if present in buttonStates
    setIsEraseNoteActive: () => {},
    setIsChangeNoteActive: () => {},
    setIsSharpActive: () => {},
    setIsFlatActive: () => {},
    setIsEraseAccidentalActive: () => {},
  };
  
  buttonStates.forEach(state => {
    // Convert from camelCase ids to is{PascalCase}Active format for backwards compatibility
    const pascalCaseId = state.id.charAt(0).toUpperCase() + state.id.slice(1);
    const legacyStateKey = `is${pascalCaseId}Active`;
    const legacySetterKey = `setIs${pascalCaseId}Active`;
    
    statesMap[legacyStateKey] = state.isActive;
    // @ts-ignore - We know this setter exists at runtime
    settersMap[legacySetterKey] = state.setter;
  });

  // Set a specific button as active and deactivate all others
  const setActive = useCallback((buttonId: string) => {
    buttonStates.forEach(state => {
      state.setter(state.id === buttonId);
    });
  }, [buttonStates]);

  // Clear all button states (set all to inactive)
  const clearAllStates = useCallback(() => {
    buttonStates.forEach(state => {
      state.setter(false);
    });
  }, [buttonStates]);

  return {
    // New interface
    buttonStates,
    setActive,
    clearAllStates,
    // Legacy interface for backward compatibility
    states: statesMap,
    setters: settersMap,
  };
};
