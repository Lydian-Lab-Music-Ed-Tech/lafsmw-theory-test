import { updateDisplayName, setUserPassword } from "@/firebase/authAPI";
import { auth } from "@/firebase/config";
import { useAuthContext } from "@/firebase/authContext";
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
  const { setUser } = useAuthContext();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    console.log(
      "[CompleteProfile:handleSubmit] Start. Current user:",
      auth.currentUser ? auth.currentUser.uid : "null",
      "Email:",
      auth.currentUser ? auth.currentUser.email : "null"
    );

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
      console.log(
        "[CompleteProfile:handleSubmit] Attempting updateDisplayName for:",
        `${firstName} ${lastName}`
      );
      await updateDisplayName(`${firstName} ${lastName}`);
      console.log(
        "[CompleteProfile:handleSubmit] updateDisplayName success. Current user:",
        auth.currentUser ? auth.currentUser.uid : "null"
      );

      console.log("[CompleteProfile:handleSubmit] Attempting setUserPassword.");
      const passwordSetSuccess = await setUserPassword(password);
      console.log(
        "[CompleteProfile:handleSubmit] setUserPassword result:",
        passwordSetSuccess,
        ". Current user after password set:",
        auth.currentUser ? auth.currentUser.uid : "null"
      );

      if (passwordSetSuccess) {
        // Ensure auth.currentUser is available and then update the context
        if (auth.currentUser) {
          setUser(auth.currentUser); // Update AuthContext with the latest user object
          console.log(
            "[CompleteProfile:handleSubmit] AuthContext updated with user:",
            auth.currentUser.uid,
            "DisplayName:",
            auth.currentUser.displayName
          );
        }
        router.push("/exam");
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
