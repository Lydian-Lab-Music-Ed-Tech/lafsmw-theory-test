"use client";
import { signOutOfApp } from "@/firebase/authAPI";
import { useAuthContext } from "@/firebase/authContext";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import CountdownTimer from "./CountdownTimer";

const Header: FC = () => {
  const router = useRouter();
  const signOutOfAppButton = () => {
    signOutOfApp();
    router.push("/");
  };

  const { user } = useAuthContext();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 1,
      }}
    >
      <Box>
        <Box
          sx={{
            textAlign: 'center',
            position: { sm: 'relative', xs: 'static' },
            left: 0,
            top: 0,
            width: '100%',
            zIndex: 3,
            color: 'black',
            transition: 'all 0.3s ease-in',
            background: 'transparent',
          }}
        >
          <Stack direction="row" p={4} justifyContent="space-between" alignItems="center">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h3"
                data-testid="main-title"
                sx={{ fontSize: { xs: '2rem', sm: '3rem' }, fontWeight: 600, color: 'black' }}
              >
                Lafayette Jazz Workshop Placement Exam
              </Typography>
            </Link>
          </Stack>
        </Box>
        {user !== null && (
          <Box>
            <CountdownTimer />
          </Box>
        )}
      </Box>

      <Box padding={2}>
        {user !== null ? (
          <div>
            <Button
              variant="contained"
              size="small"
              onClick={signOutOfAppButton}
              sx={{ padding: "8px 24px", borderRadius: "50px" }}
            >
              <Stack>
                <Typography fontSize={"14px"}>Sign Out</Typography>
                <Typography fontSize={"10px"}>{user.displayName}</Typography>
              </Stack>
            </Button>
          </div>
        ) : null}
      </Box>
    </Box>
  );
};

export default Header;
