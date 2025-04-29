"use client";
import { scalesNotationInstructions } from "@/app/lib/data/instructions";
import scalesText from "@/app/lib/data/scalesText";
import {
  FormEvent,
  InputState,
  ScaleData,
  UserDataProps,
} from "@/app/lib/types";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CardFooter from "../CardFooter";
import NotateScale from "../NotateScale";
import TutorialModal from "../TutorialModal";

export default function ScalesNotation({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  page,
}: UserDataProps) {
  const scalesPropName = `scales${page - 5}` as keyof InputState;
  const scaleDataPropName = `scaleData${page - 5}` as keyof InputState;

  const [scales, setScales] = useState<string[]>(
    currentUserData[scalesPropName] || []
  );

  const [scaleData, setScaleData] = useState<ScaleData[][]>(() => {
    const savedData = currentUserData[scaleDataPropName];
    if (savedData && typeof savedData === "object") {
      // For flat object format (from serializeScaleDataForStorage)
      if ("type" in savedData && savedData.type === "serialized_scale_data") {
        return [[]]; // Will be properly reconstructed by NotateScale
      }
    }
    return [[]];
  });

  // Serialize scale data for storage, avoiding circular references and nested arrays
  const serializeScaleDataForStorage = (data: ScaleData[][] | any) => {
    try {
      // Create a simplified flat object structure for Firebase
      // Convert the nested arrays into an object with numeric keys
      const result: Record<string, any> = { type: "serialized_scale_data" };

      // Handle empty or invalid data
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn(
          "Empty or invalid data, returning empty serialized result"
        );
        return result;
      }

      // Count how many notes we found for debugging
      let noteCount = 0;

      // Process each bar
      data.forEach((bar, barIndex) => {
        // Skip if bar is not an array
        if (!Array.isArray(bar)) {
          return;
        }

        // For each note in the bar, create a flat object with unique keys
        bar.forEach((note, noteIndex) => {
          if (!note || typeof note !== "object") return;

          noteCount++;
          const noteKey = `note_${barIndex}_${noteIndex}`;

          // Safely extract key information
          let keyValue = "";
          if (note.keys) {
            if (Array.isArray(note.keys) && note.keys.length > 0) {
              keyValue = note.keys[0];
            } else if (typeof note.keys === "string") {
              keyValue = note.keys;
            }
          }

          result[noteKey] = {
            keys: keyValue,
            duration: note.duration || "q",
            exactX: note.exactX !== undefined ? note.exactX : 0,
            userClickY: note.userClickY !== undefined ? note.userClickY : 0,
            barIndex,
            noteIndex,
          };
        });
      });

      // Store the dimensions for reconstruction
      result.barCount = data.length;
      result.noteCount = noteCount;

      return result;
    } catch (error) {
      console.error("Error serializing scale data:", error);
      return { type: "serialized_scale_data", barCount: 0, noteCount: 0 };
    }
  };

  // Save both arrays on change
  const handleSaveOnChange = (
    newScaleData: ScaleData[][],
    newScales: string[]
  ) => {
    // Don't save empty data
    if (
      newScaleData.length === 0 ||
      (newScaleData.length === 1 && newScaleData[0].length === 0)
    ) {
      console.log("Skipping save of empty scale data");
      return;
    }

    setScaleData(newScaleData);
    setScales(newScales);

    // Serialize scale data before storing in userData
    const serializedData = serializeScaleDataForStorage(newScaleData);

    // Only update if we have actual data to save
    if (serializedData.noteCount > 0) {
      setCurrentUserData({
        ...currentUserData,
        [scalesPropName]: newScales,
        [scaleDataPropName]: serializedData,
      });
    }
  };

  // Update local states when currentUserData changes
  useEffect(() => {
    const newScales = currentUserData[scalesPropName] || [];
    const newScaleData = currentUserData[scaleDataPropName] || [[]];

    // Only update if there are actual changes to avoid infinite loops
    // We need to do a shallow comparison here since deep comparison will fail
    // with the complex objects
    const scalesChanged = JSON.stringify(newScales) !== JSON.stringify(scales);
    const scaleDataLengthChanged =
      !scaleData ||
      !scaleData[0] ||
      !newScaleData ||
      !newScaleData[0] ||
      scaleData[0].length !== newScaleData[0].length;

    if (scalesChanged || scaleDataLengthChanged) {
      setScales(newScales);
      setScaleData(newScaleData);
    }
  }, [currentUserData, scalesPropName, scaleDataPropName, scales, scaleData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Only serialize and save if we have data to save
    if (scaleData.length > 0 && scaleData[0].length > 0) {
      // Simply use the current state values which should now be up-to-date
      const serializedData = serializeScaleDataForStorage(scaleData);

      if (serializedData.noteCount > 0) {
        setCurrentUserData({
          ...currentUserData,
          [scalesPropName]: scales,
          [scaleDataPropName]: serializedData,
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
