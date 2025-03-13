import React, { RefObject, ReactNode } from "react";
import SnackbarToast from "./SnackbarToast";

type NotationContainerProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  onClick?: (e: React.MouseEvent) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  children?: ReactNode;
  width?: string;
  height?: string;
};

const NotationContainer = ({
  containerRef,
  onClick,
  open,
  setOpen,
  message,
  children,
  width = "705px",
  height = "300px",
}: NotationContainerProps) => {
  return (
    <>
      <div
        ref={containerRef}
        onClick={onClick}
        style={{
          overflow: "visible",
          width,
          height,
        }}
      />
      <SnackbarToast open={open} setOpen={setOpen} message={message} />
      {children}
    </>
  );
};

export default NotationContainer;
