"use client";
import { keySigInputInstructions } from "@/app/lib/data/instructions";
import { InputData, UserDataProps } from "@/app/lib/typesAndInterfaces";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import CardFooter from "../CardFooter";
import IdentifyKeySigs from "../IdentifyKeySigs";
import TutorialModal from "../TutorialModal";

export default function KeySignaturesIdentification({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  page,
}: UserDataProps) {
  const keySigFormRef = useRef<HTMLFormElement | null>(null);

  function handleKeySignatures(input: InputData) {
    setCurrentUserData({ ...currentUserData, keySignatures: input });
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
          Section 2: Identify Key Signatures
        </Typography>
        <TutorialModal tutorialInstructions={keySigInputInstructions} />
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
          width={750}
          height={540}
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
            maxHeight={"60%"}
            spacing={4}
            sx={{
              p: 6,
              flex: 1,
              width: "100%",
            }}
          >
            <Typography variant="h6">
              Identify the following key signatures:
            </Typography>
            <IdentifyKeySigs
              currentData={currentUserData.keySignatures}
              evenbars
              handleInput={handleKeySignatures}
              ref={keySigFormRef}
              width={700}
            />
          </Stack>
          <CardFooter
            width={630}
            pageNumber={page}
            buttonForm="keySigs"
            handleSubmit={() => {
              keySigFormRef.current?.requestSubmit();
              nextViewState();
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
