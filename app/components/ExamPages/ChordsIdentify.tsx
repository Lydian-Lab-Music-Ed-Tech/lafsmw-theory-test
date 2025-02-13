"use client";
import { chordTextInstructions } from "@/app/lib/data/instructions";
import { InputData, UserDataProps } from "@/app/lib/typesAndInterfaces";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import {
  seventhChordsTreble,
  seventhChordsBass,
} from "../../lib/data/seventhChords";
import CardFooter from "../CardFooter";
import IdentifyNotation from "../IdentifyNotation";
import { useClef } from "../../context/ClefContext";
import TutorialModal from "../TutorialModal";

export default function ChordsIdentification({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  page,
}: UserDataProps) {
  const chordsFormRef = useRef<HTMLFormElement | null>(null);

  function handleChords(input: InputData) {
    setCurrentUserData({ ...currentUserData, chords: input });
  }

  const { chosenClef } = useClef();

  let seventhChords =
    chosenClef === "treble" ? seventhChordsTreble : seventhChordsBass;

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
          Section 6: Identify Chords
        </Typography>
        <TutorialModal tutorialInstructions={chordTextInstructions} />
      </Box>
      <Box
        component="main"
        width={1139}
        height={600}
        bgcolor={"secondary.main"}
        borderRadius="var(--borderRadius)"
        p={2}
        boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Stack spacing={4} p={2}>
          <Box
            width={1000}
            height={470}
            bgcolor={"card.background"}
            borderRadius="var(--borderRadius)"
            margin={"auto"}
            boxShadow="var(--cardShadow)"
            gap={10}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack
              direction="column"
              alignItems={"center"}
              justifyContent={"center"}
              maxHeight={"70%"}
              sx={{
                p: 6,
                flex: 1,
                width: "100%",
                "& .MuiTypography-h6": {
                  mb: 0,
                },
              }}
            >
              <Typography variant="h6">
                Identify the following 7th chords:
              </Typography>
              <IdentifyNotation
                chords={seventhChords}
                currentData={currentUserData.chords}
                numBars={7}
                handleInput={handleChords}
                ref={chordsFormRef}
                width={950}
              />
            </Stack>
            <CardFooter
              width={900}
              height={200}
              pageNumber={page}
              handleSubmit={() => {
                chordsFormRef.current?.requestSubmit();
                nextViewState();
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
