"use client";
import { useRouter } from "next/navigation";
import { signOutOfApp } from "@/firebase/authAPI";
import { Button, Stack, Typography, Box } from "@mui/material";

export default function SignOutPage() {
  const router = useRouter();
  const signOutOfAppButton = () => {
    signOutOfApp();
    router.push("/");
  };
  return (
    <main className="flex min-h-[500px] flex-col items-center justify-center mt-12 gap-20">
      <Typography variant="h3">Thank you!</Typography>
      <div>
        <Button variant="text" color="primary" onClick={signOutOfAppButton}>
          <Typography>Sign Out and Exit Exam</Typography>
        </Button>
      </div>
    </main>
  );
}
