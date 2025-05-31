"use client";
import { signOutOfApp } from "@/firebase/authAPI";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTimer } from "@/app/context/TimerContext";
import { useState } from "react";

export default function SignOutPage() {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const { stopTimer } = useTimer();

  const signOutOfAppButton = () => {
    setDisabled(true);
    signOutOfApp();
    stopTimer();
    router.push("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: 500,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 12,
        gap: 4,
      }}
    >
      <Typography variant="h3">
        Congratulations! You have completed the exam.
      </Typography>
      <div>
        <Button
          variant="text"
          color="primary"
          disabled={disabled}
          onClick={signOutOfAppButton}
          sx={{ p: 2, borderRadius: "70px" }}
        >
          <Typography sx={{ mx: 2 }}>
            {disabled ? "Signing out" : "Sign Out and Exit Exam"}
          </Typography>
        </Button>
      </div>
    </Box>
  );
}
