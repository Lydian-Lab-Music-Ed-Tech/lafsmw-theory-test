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
    <Box
      sx={{
        bgcolor: "white",
        paddingX: 2,
        borderRadius: "20px",
        textAlign: "center",
        width: "fit-content",
        marginLeft: 2,
      }}
    >
      <Typography variant="caption">
        Time Left: {formatTime(timeLeft)}
      </Typography>
    </Box>
  );
};

export default CountdownTimer;
