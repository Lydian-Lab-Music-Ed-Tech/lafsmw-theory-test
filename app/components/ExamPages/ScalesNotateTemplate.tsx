"use client";
import { scalesNotationInstructions } from "@/app/lib/data/instructions";
import scalesText from "@/app/lib/data/scalesText";
import { FormEvent, UserDataProps } from "@/app/lib/typesAndInterfaces";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CardFooter from "../CardFooter";
import NotateScale from "../NotateScale";
import TutorialModal from "../TutorialModal";

export default function ScalesNotation({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  page,
}: UserDataProps) {
  const [scales, setScales] = useState<Array<string>>([]);

  const scalesPropName = `scales${page - 5}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCurrentUserData({
      ...currentUserData,
      [scalesPropName]: scales,
    });
    // console.log({
    //   ...currentUserData,
    //   [scalesPropName]: scales,
    // });
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
                {`Write the following scale: ${scalesText[page - 6]}`}
              </Typography>
              <NotateScale setScales={setScales} />
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
