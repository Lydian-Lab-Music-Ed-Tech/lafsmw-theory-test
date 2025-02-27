"use client";
import { keySigNotationInstructions } from "@/app/lib/data/instructions";
import keySignaturesText from "@/app/lib/data/keySignaturesText";
import { MouseEvent, UserDataProps } from "@/app/lib/typesAndInterfaces";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CardFooter from "../CardFooter";
import NotateKeySignature from "../NotateKeySignature";
import TutorialModal from "../TutorialModal";

export default function KeySignaturesNotation({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  page,
}: UserDataProps) {
  const [keySignatureNotation, setKeySignatureNotation] = useState<string[]>(
    []
  );

  const keySigPropName = `keySignaturesNotation${page}`;

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    setCurrentUserData({
      ...currentUserData,
      [keySigPropName]: keySignatureNotation,
    });
    nextViewState();
  };

  function handleKeySigNotation(input: string[]) {
    setKeySignatureNotation(input);
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
            maxHeight={"70%"}
            sx={{
              p: 6,
              flex: 1,
              width: "100%",
            }}
          >
            <Typography variant="h6">
              {`Notate the following key signature: ${
                keySignaturesText[page - 1]
              }`}
            </Typography>
            <NotateKeySignature handleKeySig={handleKeySigNotation} />
          </Stack>
          <CardFooter
            width={630}
            pageNumber={page}
            handleSubmit={handleSubmit}
          />
        </Box>
      </Box>
    </Container>
  );
}
