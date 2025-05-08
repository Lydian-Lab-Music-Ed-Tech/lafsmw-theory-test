"use client";
import { scalesNotationInstructions } from "@/app/lib/data/instructions";
import scalesText from "@/app/lib/data/scalesText";
import {
  toFlatScaleData,
  toNestedScaleData,
} from "@/app/lib/scaleDataConverters";
import {
  FormEvent,
  InputState,
  ScaleData,
  SimpleScaleData,
  UserDataProps,
} from "@/app/lib/types";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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

  // Use the utility functions from scaleDataConverters.ts
  const reconstructScaleData = useCallback(
    (flatData: SimpleScaleData[]): ScaleData[][] => {
      const result = toNestedScaleData(flatData, chosenClef);
      return result;
    },
    [chosenClef]
  );

  // Save both arrays on change - using useCallback to prevent recreation on every render
  const handleSaveOnChange = useCallback(
    (newFlatScaleData: SimpleScaleData[], newScales: string[]) => {
      if (newFlatScaleData.length === 0) {
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
      const flatData = toFlatScaleData(scaleData);

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
