import SnackbarToast from "./SnackbarToast";
import { NotationContainerProps } from "../lib/types";

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
