"use client";
import { signOutOfApp } from "@/firebase/authAPI";
import { useAuthContext } from "@/firebase/authContext";
import { Box, Stack, Typography } from "@mui/material";
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
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
      <Box gridColumn="span 11">
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

      <Box gridColumn="span 1" padding={2}>
        {user !== null ? (
          <div>
            <CustomButton onClick={signOutOfAppButton}>
              <Stack>
                <Typography fontSize={"10px"}>{user.email}</Typography>
                <Typography>Sign Out</Typography>
              </Stack>
            </CustomButton>
          </div>
        ) : null}
      </Box>
    </Box>
  );
};

export default Header;
