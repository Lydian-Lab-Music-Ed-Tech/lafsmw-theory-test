"use client";
import { savePDF } from "@/app/lib/savePDF";
import { InputData, UserDataBluesProps } from "@/app/lib/typesAndInterfaces";
import { useAuthContext } from "@/firebase/authContext";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";
import CardFooter from "../CardFooter";
import SnackbarToast from "../SnackbarToast";
import WriteBlues from "../WriteBlues";
import TutorialModal from "../TutorialModal";
import { chordTextInstructions } from "@/app/lib/data/instructions";

export default function WriteBluesChanges({
  currentUserData,
  setCurrentUserData,
  nextViewState,
  isPDFReady,
  setIsPDFReady,
  page,
}: UserDataBluesProps) {
  const { user } = useAuthContext();
  const userName = user?.displayName?.split(" ").join("_");
  const writeBluesFormRef = useRef<HTMLFormElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  function handleBluesInput(input: InputData) {
    setCurrentUserData({ ...currentUserData, blues: input });
  }

  async function handlePDF() {
    if (!isPDFReady) {
      setIsPDFReady(true);
    }
    savePDF(userName, setCurrentUserData, currentUserData);
  }

  const boxStyle = {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box sx={boxStyle}>
        <Typography variant="h5" align="center" pb={2}>
          Section 8: Write Blues Chord Changes
        </Typography>
        <TutorialModal tutorialInstructions={chordTextInstructions} />
      </Box>
      <SnackbarToast
        open={open}
        setOpen={setOpen}
        message={"You must save the PDF before moving on."}
      />
      <Box
        component="main"
        width={1400}
        height={870}
        bgcolor={"secondary.main"}
        borderRadius="var(--borderRadius)"
        p={2}
        boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      >
        <Stack spacing={4} p={2}>
          <Box
            width={1300}
            height={800}
            bgcolor={"card.background"}
            borderRadius="var(--borderRadius)"
            margin={"auto"}
            boxShadow="var(--cardShadow)"
          >
            <Stack
              direction="column"
              alignItems={"center"}
              spacing={2}
              sx={{ p: 3 }}
            >
              <Typography variant="h6">
                Write the changes to a Bb blues using 2-5-1 in the last 4
                measures (extra credit for hip reharms):
              </Typography>
              <WriteBlues
                handleInput={handleBluesInput}
                currentData={currentUserData.blues}
                ref={writeBluesFormRef}
                width={1150}
              />

              <Stack direction="row" spacing={2}>
                <Typography marginTop={2} align="left">
                  *Note: You can enter 1 to 4 chords per bar. You
                  <b> MUST</b> press <em>Save PDF </em>before moving on.
                </Typography>
                <Button onClick={handlePDF}>
                  {isPDFReady ? "Save new" : "Save PDF"}
                </Button>
              </Stack>
            </Stack>
            <CardFooter
              width={1100}
              pageNumber={page}
              buttonText="Continue >"
              buttonForm="submit-form-blues"
              handleSubmit={() => {
                if (!isPDFReady) {
                  setOpen(true);
                } else {
                  writeBluesFormRef.current?.requestSubmit();
                  nextViewState();
                }
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
