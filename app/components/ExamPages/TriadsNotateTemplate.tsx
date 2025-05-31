"use client";
import { chordsNotationInstructions } from "@/app/lib/data/instructions";
import triadsText from "@/app/lib/data/triadsText";
import {
  FormEvent,
  InputState,
  SimpleChordData,
  UserDataProps,
} from "@/app/lib/types";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import CardFooter from "../CardFooter";
import NotateChord from "../NotateChord";
import TutorialModal from "../TutorialModal";

export default function TriadsNotation({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  page,
}: UserDataProps) {
  const triadsDataPropName = `triadsData${page - 11}` as keyof InputState;

  // Always hydrate local state from currentUserData
  const [chordData, setChordData] = useState<SimpleChordData>(() => {
    // Initialize from saved data or create empty
    const savedData = currentUserData[triadsDataPropName] as
      | SimpleChordData
      | undefined;
    if (savedData) {
      return savedData;
    } else {
      // If no saved data exists, initialize with empty array for keys
      return {
        keys: [],
        duration: "w",
        userClickY: 0,
      };
    }
  });

  const currentUserDataRef = useRef(currentUserData);

  // Save chordData to user data
  const handleSaveOnChange = useCallback(
    (newChords: string[]) => {
      // Create a SimpleChordData object from the new chords
      const newChordData: SimpleChordData = {
        ...chordData,
        keys: newChords,
      };

      setChordData(newChordData);

      // Save the chord data
      setCurrentUserData({
        ...currentUserData,
        [triadsDataPropName]: newChordData,
      });
    },
    [
      setCurrentUserData,
      triadsDataPropName,
      currentUserData,
      chordData,
    ]
  );

  // Sync chordData state if currentUserData changes (e.g. on back navigation)
  useEffect(() => {
    currentUserDataRef.current = currentUserData;
    const savedChordData = currentUserData[triadsDataPropName] as
      | SimpleChordData
      | undefined;

    // Use the saved chord data if available
    if (savedChordData) {
      // Only update if the data has actually changed
      if (JSON.stringify(savedChordData) !== JSON.stringify(chordData)) {
        setChordData(savedChordData);
      }
    }
  }, [currentUserData, triadsDataPropName, chordData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Save the chord data
    setCurrentUserData({
      ...currentUserData,
      [triadsDataPropName]: chordData,
    });
    nextViewState();
  };

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
          Section 4: Notate Triads
        </Typography>
        <TutorialModal tutorialInstructions={chordsNotationInstructions} />
      </Box>
      <Box
        component="main"
        width={1139}
        height={610}
        bgcolor={"secondary.main"}
        borderRadius="var(--borderRadius)"
        p={2}
        boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Stack spacing={4} p={2}>
          <Box
            width={850}
            height={500}
            bgcolor={"card.background"}
            borderRadius="var(--borderRadius)"
            margin={"auto"}
            boxShadow="var(--cardShadow)"
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
              maxHeight={"65%"}
              sx={{
                paddingTop: 4,
                paddingBottom: 2,
              }}
            >
              <Typography variant="h6">
                {`Write the following triad: ${triadsText[page - 12]}`}
              </Typography>
              <NotateChord
                initialChordData={chordData}
                onChange={handleSaveOnChange}
              />
            </Stack>
            <CardFooter
              width={700}
              pageNumber={page}
              handleSubmit={handleSubmit}
            />
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
