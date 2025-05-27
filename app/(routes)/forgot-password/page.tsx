"use client";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/firebase/authAPI";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetPassword(email);
    router.push("/");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" align="center">
        Forgot Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Reset Password
        </Button>
      </form>
    </Container>
  );
};

export default ForgotPassword;
