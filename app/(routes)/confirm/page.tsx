"use client";
import CompleteProfile from "@/app/components/CompleteProfile";
import { completeSignIn } from "@/firebase/authAPI";
import { Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateName, setUpdateName] = useState(false);

  useEffect(() => {
    const handleSignIn = async () => {
      const emailLink = window.location.href;
      try {
        const success = await completeSignIn(emailLink);
        if (success) {
          setUpdateName(true);
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

    handleSignIn();
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
          <Link href="/registration">
            <Button variant="text" sx={{ width: "250px" }}>
              Or sign up here
            </Button>
          </Link>
        </Stack>
      </Container>
    );
  }

  return null;
}
