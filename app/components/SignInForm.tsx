import { signIn } from "@/firebase/authAPI";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "../lib/types";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSigningIn(true);
    let success = await signIn(email, password);
    if (!success) {
      setSigningIn(false);
      alert("Invalid email or password. Please try again.");
    } else {
      router.push("/exam");
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ fontFamily: "Monospace" }}>
      <Typography variant="h5" align="center">
        Sign In
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
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={signingIn}
        >
          {signingIn ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "12px",
          transitionDuration: "0.3s",
          ":hover": { color: "primary.main" },
        }}
      >
        <Link href="/forgot-password">Forgot Password?</Link>
      </Box>
    </Container>
  );
}
