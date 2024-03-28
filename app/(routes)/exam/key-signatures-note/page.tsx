"use client";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import Staff from "@/app/components/Staff";
import ClassPreferenceSelector from "../../../components/ClassPreferenceSelector";

import ProgressBar from "@/app/components/ProgressBar";
import { instructions } from "@/app/lib/instructions";
import { MouseEvent } from "@/app/lib/typesAndInterfaces";

import { useRouter } from "next/navigation";

export default function KeySignaturesNote() {
  const router = useRouter();

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    router.push("/exam/key-signatures-text");
  };

  return (
    <Container>
      <Box
        component="main"
        width={1139}
        height={700}
        bgcolor={"secondary.main"}
        borderRadius="var(--borderRadius)"
        p={2}
        boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      >
        <Grid container spacing={4} p={2}>
          <Grid item xs={4}>
            <Stack gap={2} alignItems={"center"}>
              <Typography variant="h5" align="center">
                Section 1: Write Key Signatures
              </Typography>
              <ClassPreferenceSelector></ClassPreferenceSelector>
              <Box
                width={273}
                height={456}
                bgcolor={"card.background"}
                borderRadius="var(--borderRadius)"
                boxShadow={
                  "0px 13px 28px 0px rgba(0, 0, 0, 0.10), 0px 50px 50px 0px rgba(0, 0, 0, 0.09), 0px 113px 68px 0px rgba(0, 0, 0, 0.05), 0px 201px 80px 0px rgba(0, 0, 0, 0.01), 0px 314px 88px 0px rgba(0, 0, 0, 0.00)"
                }
              >
                <Stack mx={3} p={1}>
                  <Typography variant="h6" align="center">
                    Tutorial
                  </Typography>
                  <List>
                    {instructions.map((value, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemText
                          primary={`${index + 1}. ${value.instructionTitle}`}
                          secondary={value.instructionText}
                          primaryTypographyProps={{ fontSize: "11px" }}
                          secondaryTypographyProps={{ fontSize: "11px" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Stack>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={8} margin={"auto"}>
            <Box
              width={569}
              height={540}
              bgcolor={"card.background"}
              borderRadius="var(--borderRadius)"
              margin={"auto"}
              boxShadow={
                "0px 13px 28px 0px rgba(0, 0, 0, 0.10), 0px 50px 50px 0px rgba(0, 0, 0, 0.09), 0px 113px 68px 0px rgba(0, 0, 0, 0.05), 0px 201px 80px 0px rgba(0, 0, 0, 0.01), 0px 314px 88px 0px rgba(0, 0, 0, 0.00)"
              }
            >
              <Grid
                container
                columns={1}
                direction="column"
                alignItems={"center"}
                marginY={"auto"}
                p={4}
                spacing={2}
              >
                <Grid item>
                  <Typography variant="h6">
                    Add the following key signature: Db Major
                  </Typography>
                </Grid>
                <Grid item>
                  <Staff
                    addDoubleBarLine={true}
                    width={472}
                    noTimeSignature={true}
                    numBars={1}
                  />
                </Grid>
                <Grid item>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    mt={2}
                    spacing={2}
                  >
                    <Button variant="contained">#</Button>
                    <Button variant="contained">b</Button>
                  </Stack>
                </Grid>
                <Grid item>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    mt={2}
                    spacing={2}
                  >
                    <Button variant="contained">Eraser</Button>
                    <Button variant="contained">Clear Measure</Button>
                  </Stack>
                </Grid>
                <Grid item>
                  <Divider sx={{ paddingY: "16px", marginBottom: "12px" }} />
                </Grid>
                <Grid item>
                  <Stack direction="row" justifyContent="center" spacing={8}>
                    <Stack gap={2}>
                      <Typography variant="body1">Question 1/45</Typography>
                      <ProgressBar value={4} />
                    </Stack>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      sx={{ height: "33px", marginTop: "8px" }}
                    >
                      {"Next Question >"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}