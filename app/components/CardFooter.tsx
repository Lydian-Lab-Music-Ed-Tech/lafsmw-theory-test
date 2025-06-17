import { Box, Button, Stack, Typography } from "@mui/material";
import ProgressBar from "./ProgressBar";
import { CardFooterProps } from "../lib/types";

export default function CardFooter({
  width = 470,
  height = 100,
  pageNumber,
  buttonType = "submit",
  buttonText = "Continue >",
  handleSubmit,
  buttonForm,
}: CardFooterProps) {
  return (
    <Box
      width={width}
      height={height}
      margin={"auto"}
      py={1}
      data-testid="card-footer"
      sx={{
        borderTop: "1px solid var(--primary50)",
      }}
    >
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
          >{`Page: ${pageNumber}/27`}</Typography>
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
