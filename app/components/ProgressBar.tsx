import React from "react";
import LinearProgress from "@mui/material/LinearProgress";

export default function ProgressBar({ value }: { value: number }) {
  const adjustedValue = Math.floor((value / 27) * 100);
  return (
    <div>
      <LinearProgress
        variant="determinate"
        color="primary"
        value={adjustedValue}
        sx={{
          backgroundColor: "progressBar.unfilled",
          height: "13px",
          width: "216px",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
        data-testid="progress-bar"
      />
    </div>
  );
}
