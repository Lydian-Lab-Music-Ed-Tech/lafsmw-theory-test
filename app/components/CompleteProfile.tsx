import { setUserPassword, updateDisplayName } from "@/firebase/authAPI";
import { useAuthContext } from "@/firebase/authContext";
import { auth } from "@/firebase/config";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "../lib/types";

export default function CompleteProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { refreshUser } = useAuthContext();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!auth.currentUser) {
      console.error(
        "[CompleteProfile:handleSubmit] No current user found at start of submit. Aborting."
      );
      setError("No active session. Please try signing in again.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }
    setIsProcessing(true);
    try {
      await updateDisplayName(`${firstName} ${lastName}`);
      const passwordSetSuccess = await setUserPassword(password);
      if (passwordSetSuccess) {
        if (auth.currentUser) {
          try {
            // Use the refreshUser function to update the auth context
            await refreshUser();
            router.push("/exam");
          } catch (reloadError) {
            console.error(
              "[CompleteProfile:handleSubmit] Error refreshing user:",
              reloadError
            );
            setError(
              "Profile updated, but failed to refresh session. Please try logging out and in."
            );
            // Still might want to redirect or offer a way out
            router.push("/");
          }
        } else {
          // This case should ideally not be reached if passwordSetSuccess is true and auth.currentUser was checked before
          setError("Session lost. Please try signing in again.");
        }
      } else {
        setError(
          "Failed to set password. Please try again. Check console for details from setUserPassword."
        );
      }
    } catch (err) {
      console.error("[CompleteProfile:handleSubmit] CATCH BLOCK error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ fontFamily: "Monospace", py: 4 }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Complete Your Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          fullWidth
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          autoFocus
        />
        <TextField
          margin="normal"
          fullWidth
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Complete Profile & Continue"}
        </Button>
      </form>
    </Container>
  );
}
