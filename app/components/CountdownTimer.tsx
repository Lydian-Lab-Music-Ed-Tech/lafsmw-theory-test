"use client";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTimer } from "../context/TimerContext";

const CountdownTimer = () => {
  const { timeLeft } = useTimer();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <Box className="bg-white px-4 ml-16 rounded-full text-center w-fit">
      <Typography variant="caption">
        Time Left: {formatTime(timeLeft)}
      </Typography>
    </Box>
  );
};

export default CountdownTimer;
