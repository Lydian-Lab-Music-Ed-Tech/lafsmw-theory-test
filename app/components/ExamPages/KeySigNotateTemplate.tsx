"use client";
import { keySigNotationInstructions } from "@/app/lib/data/instructions";
import keySignaturesText from "@/app/lib/data/keySignaturesText";
import {
  GlyphProps,
  InputState,
  MouseEvent,
  UserDataProps,
} from "@/app/lib/types";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CardFooter from "../CardFooter";
import NotateKeySignature from "../NotateKeySignature";
import TutorialModal from "../TutorialModal";

export default function KeySignaturesNotation({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  page,
}: UserDataProps) {
  const keySigPropName = `keySignaturesNotation${page}` as keyof InputState;
  const keySigGlyphPropName =
    `keySignatureGlyphsNotation${page}` as keyof InputState;

  const [keySignatureNotation, setKeySignatureNotation] = useState<string[]>(
    currentUserData[keySigPropName] || []
  );
  const [keySignatureGlyphs, setKeySignatureGlyphs] = useState<GlyphProps[]>(
    currentUserData[keySigGlyphPropName] || []
  );

  // Save both arrays on change
  const handleSaveOnChange = (
    newKeySigNotes: string[],
    newGlyphs: GlyphProps[]
  ) => {
    // Update local state immediately with the new data from NotateKeySignature
    setKeySignatureNotation(newKeySigNotes);
    setKeySignatureGlyphs(newGlyphs);
    
    // Update parent state immediately - this is critical for the data to be properly saved
    setCurrentUserData({
      ...currentUserData,
      [keySigPropName]: newKeySigNotes,
      [keySigGlyphPropName]: newGlyphs,
    });
  };

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    
    console.log("KeySigNotateTemplate - handleSubmit:", keySignatureNotation);
    
    // Force a final update to ensure we have the most up-to-date state before navigation
    setCurrentUserData({
      ...currentUserData,
      [keySigPropName]: keySignatureNotation,
      [keySigGlyphPropName]: keySignatureGlyphs,
    });
    
    // Proceed to next view
    nextViewState();
  };

  // Update local states when currentUserData changes
  useEffect(() => {
    const newNotes = currentUserData[keySigPropName] || [];
    const newGlyphs = currentUserData[keySigGlyphPropName] || [];
    if (
      JSON.stringify(newNotes) !== JSON.stringify(keySignatureNotation) ||
      JSON.stringify(newGlyphs) !== JSON.stringify(keySignatureGlyphs)
    ) {
      setKeySignatureNotation(newNotes);
      setKeySignatureGlyphs(newGlyphs);
    }
  }, [
    currentUserData,
    keySigPropName,
    keySigGlyphPropName,
    keySignatureNotation,
    keySignatureGlyphs,
  ]);

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
          Section 1: Notate Key Signatures
        </Typography>
        <TutorialModal tutorialInstructions={keySigNotationInstructions} />
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
            maxHeight={"65%"}
            sx={{
              paddingTop: 4,
              paddingBottom: 2,
            }}
          >
            <Typography variant="h6">
              {`Notate the following key signature: ${
                keySignaturesText[page - 1]
              }`}
            </Typography>
            <NotateKeySignature
              initialKeySignature={keySignatureNotation}
              initialGlyphs={keySignatureGlyphs}
              onChange={handleSaveOnChange}
            />
          </Stack>
          <CardFooter
            width={700}
            pageNumber={page}
            handleSubmit={handleSubmit}
          />
        </Box>
      </Box>
    </Container>
  );
}
