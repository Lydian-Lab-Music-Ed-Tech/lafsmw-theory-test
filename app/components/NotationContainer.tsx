import React, { ReactNode } from "react";
import { Container } from "@mui/material";
import SnackbarToast from "./SnackbarToast";

interface NotationContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  onClick?: (e: React.MouseEvent) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  children: ReactNode;
  gridCols?: string;
  containerWidth?: string;
  containerHeight?: string;
}

/**
 * A shared container for notation components with standardized styling and layout
 */
const NotationContainer: React.FC<NotationContainerProps> = ({
  containerRef,
  onClick,
  open,
  setOpen,
  message,
  children,
  gridCols = "1fr 1fr 1fr",
  containerWidth = "705px",
  containerHeight = "300px",
}) => {
  return (
    <>
      <div
        ref={containerRef}
        onClick={onClick}
        style={{
          overflow: "visible",
          width: containerWidth,
          height: containerHeight,
        }}
      />
      <SnackbarToast open={open} setOpen={setOpen} message={message} />
      <Container
        sx={{
          display: "grid",
          gridTemplateColumns: gridCols,
          paddingTop: 4,
          marginTop: 2,
        }}
      >
        {children}
      </Container>
    </>
  );
};

export default NotationContainer;
