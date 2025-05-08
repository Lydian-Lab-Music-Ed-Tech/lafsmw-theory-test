"use client";
import { chordsNotationInstructions } from "@/app/lib/data/instructions";
import triadsText from "@/app/lib/data/triadsText";
import {
  toSimpleChordData,
  toChordWithVexFlow,
} from "@/app/lib/chordDataConverters";
import {
  Chord,
  FormEvent,
  InputState,
  SimpleChordData,
  UserDataProps,
} from "@/app/lib/types";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useClef } from "../../context/ClefContext";
import CardFooter from "../CardFooter";
import NotateChord from "../NotateChord";
import TutorialModal from "../TutorialModal";

export default function TriadsNotation({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  page,
}: UserDataProps) {
  const { chosenClef } = useClef();
  const triadsPropName = `triads${page - 11}` as keyof InputState;
  const triadsDataPropName = `triadsData${page - 11}` as keyof InputState;

  // Always hydrate local state from currentUserData
  const [chords, setChords] = useState<string[]>(
    (currentUserData[triadsPropName] as string[]) || []
  );

  const [chordData, setChordData] = useState<SimpleChordData>(() => {
    // Initialize from saved data or create empty
    const savedData = currentUserData[triadsDataPropName] as
      | SimpleChordData
      | undefined;
    if (savedData) {
      return savedData;
    } else {
      return {
        keys: chords,
        duration: "w",
        userClickY: 0,
      };
    }
  });

  const currentUserDataRef = useRef(currentUserData);

  // Save both to state and user data
  const handleSaveOnChange = useCallback(
    (newChords: string[]) => {
      setChords(newChords);

      // Create a SimpleChordData object from the new chords
      const newChordData: SimpleChordData = {
        ...chordData,
        keys: newChords,
      };

      setChordData(newChordData);

      // Save both the chord strings and the chord data
      setCurrentUserData({
        ...currentUserData,
        [triadsPropName]: newChords,
        [triadsDataPropName]: newChordData,
      });
    },
    [
      setCurrentUserData,
      triadsPropName,
      triadsDataPropName,
      currentUserData,
      chordData,
    ]
  );

  // Sync chords state if currentUserData changes (e.g. on back navigation)
  useEffect(() => {
    currentUserDataRef.current = currentUserData;

    const newChords = (currentUserData[triadsPropName] as string[]) || [];
    const newChordData = currentUserData[triadsDataPropName] as
      | SimpleChordData
      | undefined;

    // Check if chords have changed
    const chordsChanged = JSON.stringify(newChords) !== JSON.stringify(chords);

    // Update local state if needed
    if (chordsChanged) {
      setChords(newChords);

      // If we have chord data, use it; otherwise create from chords
      if (newChordData) {
        setChordData(newChordData);
      } else if (newChords.length > 0) {
        setChordData({
          keys: newChords,
          duration: "w",
          userClickY: 0,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserData, triadsPropName, triadsDataPropName]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Save both the chord strings and the chord data
    setCurrentUserData({
      ...currentUserData,
      [triadsPropName]: chords,
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
              maxHeight={"70%"}
              sx={{
                p: 6,
                flex: 1,
                width: "100%",
              }}
            >
              <Typography variant="h6">
                {`Write the following triad: ${triadsText[page - 12]}`}
              </Typography>
              <NotateChord
                initialChords={chords}
                initialChordData={chordData}
                onChange={handleSaveOnChange}
              />
            </Stack>
            <CardFooter
              width={630}
              pageNumber={page}
              handleSubmit={handleSubmit}
            />
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
