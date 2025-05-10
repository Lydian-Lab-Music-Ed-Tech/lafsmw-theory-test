"use client";
import { signOutOfApp } from "@/firebase/authAPI";
import { useAuthContext } from "@/firebase/authContext";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import CountdownTimer from "./CountdownTimer";
import CustomButton from "./CustomButton";

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
        <div className="text-center sm:flex left-0 top-0 w-full z-[3] ease-in duration-300 text-black">
          <div className="flex p-4 justify-between">
            <Link href="/">
              <h1 className="text-3xl" data-testid="main-title">
                Lafayette Jazz Workshop Placement Exam
              </h1>
            </Link>
          </div>
        </div>
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
              fullWidth
              onClick={signOutOfAppButton}
              sx={{ padding: "8px 24px", borderRadius: "20px" }}
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
