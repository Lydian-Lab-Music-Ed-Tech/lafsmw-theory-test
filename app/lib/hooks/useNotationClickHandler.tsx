import { RefObject, useCallback } from "react";
import { errorMessages } from "../data/errorMessages";
import getUserClickInfo from "../getUserClickInfo";
import { UseNotationClickHandlerProps } from "../types";

export const useNotationClickHandler = ({
  containerRef,
  staves,
  notesAndCoordinates,
  setOpen,
  setMessage,
}: UseNotationClickHandlerProps) => {
  const getClickInfo = useCallback(
    (e: React.MouseEvent) => {
      if (!staves.length || !containerRef.current) {
        return null;
      }

      const { userClickY, userClickX, topStaveYCoord, bottomStaveYCoord } =
        getUserClickInfo(
          e,
          containerRef as RefObject<HTMLDivElement>,
          staves[0]
        );

      let foundNoteData = notesAndCoordinates.find(
        ({ yCoordinateMin, yCoordinateMax }) =>
          userClickY >= yCoordinateMin && userClickY <= yCoordinateMax
      );

      if (!foundNoteData) {
        setOpen(true);
        setMessage(
          errorMessages.noNoteFound || "No note found at click position"
        );
        return null;
      }

      return {
        userClickX,
        userClickY,
        topStaveYCoord,
        bottomStaveYCoord,
        foundNoteData: {
          ...foundNoteData,
          userClickX,
          userClickY,
        },
      };
    },
    [staves, notesAndCoordinates, containerRef, setOpen, setMessage]
  );

  return { getClickInfo };
};
