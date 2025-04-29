"use client";
import { scalesNotationInstructions } from "@/app/lib/data/instructions";
import scalesText from "@/app/lib/data/scalesText";
import {
  FormEvent,
  InputState,
  ScaleData,
  SimpleScaleData,
  UserDataProps,
} from "@/app/lib/types";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Flow } from "vexflow";
import { useClef } from "../../context/ClefContext";
import CardFooter from "../CardFooter";
import NotateScale from "../NotateScale";
import TutorialModal from "../TutorialModal";

export default function ScalesNotation({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  page,
}: UserDataProps) {
  const { chosenClef } = useClef();
  const scalesPropName = `scales${page - 5}` as keyof InputState;
  const scaleDataPropName = `scaleData${page - 5}` as keyof InputState;

  const [scales, setScales] = useState<string[]>(
    currentUserData[scalesPropName] || []
  );

  const [scaleData, setScaleData] = useState<ScaleData[][]>([[]]);

  // Convert 2D ScaleData array to flat SimpleScaleData array for storage
  const convertToFlatScaleData = useCallback((data: ScaleData[][]) => {
    try {
      const flatData: SimpleScaleData[] = [];
      // Process each bar
      for (let barIndex = 0; barIndex < data.length; barIndex++) {
        const bar = data[barIndex];
        if (!Array.isArray(bar)) {
          continue;
        }
        // For each note in the bar, create a SimpleScaleData object
        for (let noteIndex = 0; noteIndex < bar.length; noteIndex++) {
          const note = bar[noteIndex];
          if (
            !note ||
            typeof note !== "object" ||
            !note.keys ||
            note.keys.length === 0
          ) {
            continue;
          }
          flatData.push({
            keys: note.keys,
            duration: note.duration || "q",
            exactX: note.exactX !== undefined ? note.exactX : 0,
            userClickY: note.userClickY !== undefined ? note.userClickY : 0,
            barIndex,
            noteIndex,
          });
        }
      }
      return flatData;
    } catch (error) {
      console.error("Error converting scale data:", error);
      return [];
    }
  }, []);

  // Function to reconstruct a 2D array from flat SimpleScaleData, memoized with useCallback
  const reconstructScaleData = useCallback(
    (flatData: SimpleScaleData[]): ScaleData[][] => {
      if (!flatData || !flatData.length) {
        return [[]];
      }
      // Find the maximum barIndex to determine array size
      const maxBarIndex = Math.max(
        ...flatData.map((note) => note.barIndex || 0)
      );
      // Create array of arrays
      const result: ScaleData[][] = Array(maxBarIndex + 1)
        .fill(null)
        .map(() => []);
      // Place each note in the correct position
      for (let i = 0; i < flatData.length; i++) {
        const note = flatData[i];
        if ((note.barIndex || 0) >= 0 && note.keys && note.keys.length > 0) {
          // Create VexFlow StaveNote for UI rendering
          let staveNote = null;
          try {
            staveNote = new Flow.StaveNote({
              keys: [...note.keys],
              duration: note.duration || "q",
              clef: chosenClef,
            });
            // Add accidentals if needed
            const keyToCheck = note.keys[0];
            if (keyToCheck && keyToCheck.includes("#")) {
              staveNote.addModifier(new Flow.Accidental("#"), 0);
            } else if (keyToCheck && keyToCheck.includes("b")) {
              staveNote.addModifier(new Flow.Accidental("b"), 0);
            }
          } catch (error) {
            console.error(
              "Error creating stave note in reconstruction:",
              error
            );
          }
          // Create the full ScaleData object with staveNote
          const scaleData: ScaleData = {
            keys: note.keys,
            duration: note.duration,
            exactX: note.exactX,
            userClickY: note.userClickY,
            staveNote: staveNote,
          };
          // Add to the result array in the correct position
          // Ensure we have indexes for the proper position
          while (result[note.barIndex || 0].length <= (note.noteIndex || 0)) {
            result[note.barIndex || 0].push({
              keys: [],
              duration: "q",
              exactX: 0,
              userClickY: 0,
              staveNote: null,
            });
          }
          result[note.barIndex || 0][note.noteIndex || 0] = scaleData;
        }
      }
      return result;
    },
    [chosenClef]
  );

  // Save both arrays on change - using useCallback to prevent recreation on every render
  const handleSaveOnChange = useCallback(
    (newFlatScaleData: SimpleScaleData[], newScales: string[]) => {
      if (newFlatScaleData.length === 0) {
        console.log("Skipping save of empty scale data");
        return;
      }
      // Convert the flat data back to a 2D array for the UI component
      const reconstructed2DArray = reconstructScaleData(newFlatScaleData);
      setScaleData(reconstructed2DArray);
      setScales(newScales);
      setCurrentUserData({
        ...currentUserData,
        [scalesPropName]: newScales,
        [scaleDataPropName]: newFlatScaleData,
      });
    },
    [
      reconstructScaleData,
      currentUserData,
      scalesPropName,
      scaleDataPropName,
      setScaleData,
      setScales,
      setCurrentUserData,
    ]
  );

  useEffect(() => {
    const newScales = currentUserData[scalesPropName] || [];
    const savedScaleData = currentUserData[scaleDataPropName] as
      | SimpleScaleData[]
      | undefined;

    // Only update if there are actual changes to avoid infinite loops
    const scalesChanged = JSON.stringify(newScales) !== JSON.stringify(scales);

    // Store the current data signature in a ref to track changes
    const currentDataEmpty =
      !scaleData || !scaleData[0] || scaleData[0].length === 0;

    // Only update if scales changed or we need to initialize data
    if (scalesChanged || currentDataEmpty) {
      setScales(newScales);

      // If we have saved flat data, reconstruct the 2D array for UI
      if (
        savedScaleData &&
        Array.isArray(savedScaleData) &&
        savedScaleData.length > 0
      ) {
        const reconstructed = reconstructScaleData(savedScaleData);
        setScaleData(reconstructed);
      } else {
        // Initialize with empty array if no data
        setScaleData([[]]);
      }
    }
  }, [
    currentUserData,
    scalesPropName,
    scaleDataPropName,
    scales,
    reconstructScaleData,
  ]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Only save if we have data to save
    if (
      scaleData &&
      Array.isArray(scaleData) &&
      scaleData.length > 0 &&
      Array.isArray(scaleData[0]) &&
      scaleData[0].length > 0
    ) {
      // Convert to flat structure for Firebase storage
      const flatData = convertToFlatScaleData(scaleData);

      if (flatData && Array.isArray(flatData) && flatData.length > 0) {
        setCurrentUserData({
          ...currentUserData,
          [scalesPropName]: scales,
          [scaleDataPropName]: flatData,
        });
      }
    } else {
      console.log("No scale data to save on submit");
    }

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
          Section 3: Notate Scales
        </Typography>
        <TutorialModal tutorialInstructions={scalesNotationInstructions} />
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
                {`Write the following scale: ${scalesText[page - 6]}`}
              </Typography>
              <NotateScale
                initialScaleData={scaleData}
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
