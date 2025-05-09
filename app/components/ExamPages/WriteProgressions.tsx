"use client";
import { chordTextInstructions } from "@/app/lib/data/instructions";
import { InputData, UserDataProps } from "@/app/lib/types";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import CardFooter from "../CardFooter";
import TutorialModal from "../TutorialModal";
import WriteProgression from "../WriteProgression";

export default function WriteProgressions({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  page,
}: UserDataProps) {
  const writeProgressionsFormRef = useRef<HTMLFormElement | null>(null);

  function handleProgressions(input: InputData) {
    setCurrentUserData({ ...currentUserData, progressions: input });
  }

  const boxStyle = {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    maxWidth: "1139px",
  };

  return (
    <Container>
      <Box sx={boxStyle}>
        <Typography variant="h5" align="center" pb={2}>
          Section 7: Write Progressions
        </Typography>
        <TutorialModal tutorialInstructions={chordTextInstructions} />
      </Box>
      <Box
        component="main"
        width={1139}
        height={660}
        bgcolor={"secondary.main"}
        borderRadius="var(--borderRadius)"
        p={2}
        boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          width={1000}
          height={600}
          bgcolor={"card.background"}
          borderRadius="var(--borderRadius)"
          margin={"auto"}
          boxShadow="var(--cardShadow)"
          sx={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-between",
          }}
        >
          <Stack
            direction="column"
            alignItems={"center"}
            spacing={2}
            sx={{ p: 3 }}
          >
            <Typography variant="h6" marginBottom={2}>
              Write 2-5-1 Progressions in the following keys:
            </Typography>
            <WriteProgression
              handleInput={handleProgressions}
              currentData={currentUserData.progressions}
              ref={writeProgressionsFormRef}
              width={950}
            />
          </Stack>
          <CardFooter
            width={900}
            height={100}
            pageNumber={page}
            handleSubmit={() => {
              writeProgressionsFormRef.current?.requestSubmit();
              nextViewState();
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
