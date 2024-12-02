"use client";
import { List, ListItem, ListItemText, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useState } from "react";

type TutorialInstructions = {
  instructionTitle: string;
  instructionText: string;
};

interface TutorialModalProps {
  tutorialInstructions: TutorialInstructions[];
}

export default function TutorialModal({
  tutorialInstructions,
}: TutorialModalProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant={"contained"} onClick={handleOpen} size="large">
        Need Help?
      </Button>
      <Modal open={open} onClose={handleClose} role="dialog">
        <Box
          width={600}
          height={456}
          bgcolor={"card.background"}
          borderRadius="var(--borderRadius)"
          boxShadow="var(--cardShadow)"
          position={"absolute"}
          top={"25%"}
          left={"28%"}
        >
          <Stack mx={3} p={1}>
            <Typography variant="h6" align="center">
              Tutorial
            </Typography>
            <List>
              {tutorialInstructions.map((value, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemText
                    primary={`${index + 1}. ${value.instructionTitle}`}
                    secondary={value.instructionText}
                    primaryTypographyProps={{ fontSize: "16px" }}
                    secondaryTypographyProps={{ fontSize: "16px" }}
                  />
                </ListItem>
              ))}
            </List>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
