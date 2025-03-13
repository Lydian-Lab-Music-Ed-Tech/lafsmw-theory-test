"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContextType, CreateTimerContextType } from "../lib/types";

const initialState: CreateTimerContextType = {
  timeLeft: 0,
  isRunning: false,
  startTimer: () => {},
  stopTimer: () => {},
};

const TimerContext = createContext(initialState);

export const TimerProvider = ({ children }: AuthContextType) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [onTimeUp, setOnTimeUp] = useState<any>(null);

  useEffect(() => {
    let intervalId: number | NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isRunning) {
      setIsRunning(false);
      setTimeLeft(0);
      if (onTimeUp) onTimeUp();
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, onTimeUp]);

  const startTimer = (
    duration: SetStateAction<number>,
    callback: () => void
  ) => {
    setTimeLeft(duration);
    setIsRunning(true);
    setOnTimeUp(() => callback);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  return (
    <TimerContext.Provider
      value={{ timeLeft, isRunning, startTimer, stopTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
}
