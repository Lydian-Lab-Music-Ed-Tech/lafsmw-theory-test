"use client";
import { createContext, useState, useContext, useEffect } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [onTimeUp, setOnTimeUp] = useState(null);

  useEffect(() => {
    let intervalId;
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

  const startTimer = (duration, callback) => {
    setTimeLeft(duration);
    setIsRunning(true);
    setOnTimeUp(() => callback);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  return (
    <TimerContext.Provider
      value={{ timeLeft, isRunning, startTimer, stopTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);