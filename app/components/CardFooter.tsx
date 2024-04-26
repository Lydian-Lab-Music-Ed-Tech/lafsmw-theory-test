import { Box, Divider, Stack, Typography, Button } from "@mui/material";
import ProgressBar from "./ProgressBar";

interface CardFooterProps {
  width?: number;
  height?: number;
  pageNumber: number;
  buttonType?: "submit" | "button" | "reset" | undefined;
  buttonText?: string;
  handleSubmit?: any;
  buttonForm?: string;
}

export default function CardFooter({
  width = 470,
  height = 100,
  pageNumber,
  buttonType = "submit",
  buttonText = "Save and Continue",
  handleSubmit,
  buttonForm,
}: CardFooterProps) {
  return (
    <Box width={width} height={height} margin={"auto"} alignContent={"center"}>
      <Divider sx={{ paddingY: "16px", marginBottom: "12px" }} />
      <Stack
        direction="row"
        spacing={8}
        justifyContent={"space-between"}
        alignItems={"end"}
      >
        <Stack gap={2}>
          <Typography
            variant="body2"
            fontWeight="600"
          >{`Page: ${pageNumber}/16`}</Typography>
          <ProgressBar value={Number(pageNumber)} />
        </Stack>
        <Button
          variant="contained"
          type={buttonType}
          onClick={handleSubmit}
          form={buttonForm}
          sx={{ height: "33px", marginTop: "8px" }}
        >
          {buttonText}
        </Button>
      </Stack>
    </Box>
  );
}
