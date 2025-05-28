"use client";
import CompleteProfile from "@/app/components/CompleteProfile";
import { completeSignIn } from "@/firebase/authAPI";
import { auth } from "@/firebase/config";
import { Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ConfirmSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateName, setUpdateName] = useState(false);
  const signInAttemptedRef = useRef(false);

  useEffect(() => {
    const handleSignIn = async () => {
      const emailLink = window.location.href;
      try {
        const success = await completeSignIn(emailLink);
        if (success) {
          // If user already has a display name, go to exam, otherwise we'll return CompleteProfile (by setting updateName to true)
          if (auth.currentUser && auth.currentUser.displayName) {
            router.push("/exam");
          } else {
            setUpdateName(true);
          }
        } else {
          setError("Sign-in failed. Please try again.");
        }
      } catch (err) {
        setError("An error occurred during sign-in.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!signInAttemptedRef.current) {
      handleSignIn();
      signInAttemptedRef.current = true;
    }
  }, [router]);

  if (loading) {
    return (
      <Typography variant="body1" p={4}>
        Loading...
      </Typography>
    );
  }

  if (updateName) {
    return <CompleteProfile />;
  }

  if (error) {
    return (
      <Container sx={{ paddingTop: "44px" }}>
        <Typography variant="h6" align="center" p={4}>
          {error}
        </Typography>
        <Stack spacing={4} alignItems={"center"}>
          <Link href="/login">
            <Button variant="text" sx={{ width: "250px" }}>
              Try login again
            </Button>
          </Link>
          <Link href="/">
            <Button variant="text" sx={{ width: "250px" }}>
              Or log in or sign up here
            </Button>
          </Link>
        </Stack>
      </Container>
    );
  }

  return null;
}
