"use client";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import SignInForm from "../../components/SignInForm";
import SignUpForm from "../../components/SignUpForm";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export default function Registration() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const toggleIsSignUp = () => {
    setIsSignUp((prev) => !prev);
    setShowButtons(false);
  };

  const toggleIsSignIn = () => {
    setIsSignIn((prev) => !prev);
    setShowButtons(false);
  };

  const goBack = () => {
    setShowButtons(true);
    setIsSignIn(false);
    setIsSignUp(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Stack spacing={8}>
        {showButtons && (
          <Stack spacing={2}>
            <Typography>New to LAFSMW? Sign up here:</Typography>
            <Button variant="contained" onClick={toggleIsSignUp}>
              Sign Up
            </Button>
          </Stack>
        )}

        {showButtons && (
          <Stack spacing={2}>
            <Typography>Returning student? Sign in here:</Typography>
            <Button variant="contained" onClick={toggleIsSignIn}>
              Sign In
            </Button>
          </Stack>
        )}
        {isSignUp && (
          <Stack spacing={4}>
            <SignUpForm />
            <Button variant="text" onClick={goBack}>
              Go Back
            </Button>
          </Stack>
        )}
        {isSignIn && (
          <Grid xs={12} container justifyContent="center" gap={4}>
            <SignInForm />
            <Button variant="text" onClick={goBack} sx={{ width: "73%" }}>
              Go Back
            </Button>
          </Grid>
        )}
      </Stack>
    </main>
  );
}
