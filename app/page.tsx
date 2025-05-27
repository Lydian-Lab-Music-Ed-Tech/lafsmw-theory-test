"use client";
import { useAuthContext } from "@/firebase/authContext";
import { Box, Button, Stack, Typography, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    if (user !== null) {
      router.push("/exam");
    }
  }, [router, user]);

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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        p: 6,
      }}
    >
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
          <Grid container justifyContent="center" gap={4}>
            <SignUpForm />
            <Button variant="text" onClick={goBack} sx={{ width: "73%" }}>
              Go Back
            </Button>
          </Grid>
        )}
        {isSignIn && (
          <Grid container justifyContent="center" gap={4}>
            <SignInForm />
            <Button variant="text" onClick={goBack} sx={{ width: "73%" }}>
              Go Back
            </Button>
          </Grid>
        )}
      </Stack>
    </Box>
  );
}
