"use client";
import { useAuthContext } from "@/firebase/authContext";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import FormInput from "./components/FormInput";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [isUnreleased, setIsUnreleased] = useState(true);
  const [password, setPassword] = useState("");

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

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const checkPassword = () => {
    if (password === "tacotuesday") {
      setIsUnreleased(false);
    } else {
      setIsUnreleased(true);
    }
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
      {isUnreleased && (
        <Stack spacing={8} marginTop={8}>
          <Typography variant="h5" align="center">
            Welcome to the official site of the Lafayette Jazz Workshop Theory
            Exam!
          </Typography>
          <Typography variant="body1" align="center">
            This exam has not been officially released to students yet. If you
            have been authorized to take this test, please enter the password
            given to you by the instructor.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <FormInput
              labelText="Enter Password:"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              width="100%"
              textAlign="left"
            />
            <Button
              variant="text"
              onClick={checkPassword}
              sx={{ width: "100px", borderRadius: "50px" }}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      )}
      {!isUnreleased && (
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
      )}
    </Box>
  );
}
