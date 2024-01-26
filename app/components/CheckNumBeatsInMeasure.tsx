import { Snackbar, Alert } from "@mui/material/";

interface CheckNumBeatsInMeasureProps {
  tooManyBeatsInMeasure: boolean;
  openEnterNotes: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckNumBeatsInMeasure: React.FC<CheckNumBeatsInMeasureProps> = ({
  tooManyBeatsInMeasure,
  openEnterNotes: openEnterNotes,
}) => {
  return (
    <div>
      <Snackbar
        open={tooManyBeatsInMeasure}
        autoHideDuration={3000}
        onClose={() => openEnterNotes(true)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert variant="filled" severity="error">
          {"You've entered too many beats in this measure"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CheckNumBeatsInMeasure;
