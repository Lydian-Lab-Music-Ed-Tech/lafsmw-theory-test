"use client";
import { createTheme } from "@mui/material";
import tokens from "./tokens.json";

const theme = createTheme({
  palette: {
    primary: {
      main: tokens.global.md.sys.color["enabled-button-color"].value,
    },
    secondary: {
      main: tokens.global.md.sys.color["pressed-button-color"].value,
    },
    info: {
      main: "#696969",
    },
    success: {
      main: "#00FF00",
    },
    warning: {
      main: "#ff7f7f",
    },
    background: {
      main: tokens.global.md.sys.color["main-background-color"].value,
      card: tokens.global.md.sys.color["card-background-color"].value,
    },
    card: {
      background: "#FAF5F3",
      shadow:
        "0px 13px 28px 0px rgba(0, 0, 0, 0.10), 0px 50px 50px 0px rgba(0, 0, 0, 0.09), 0px 113px 68px 0px rgba(0, 0, 0, 0.05), 0px 201px 80px 0px rgba(0, 0, 0, 0.01), 0px 314px 88px 0px rgba(0, 0, 0, 0.00)",
    },
    progressBar: {
      filled: tokens.global.md.sys.color["filled-progress-bar-color"].value,
      unfilled: tokens.global.md.sys.color["unfilled-progress-bar-color"].value,
    },
  },
  typography: {
    fontFamily: "inherit",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // borderRadius: `${tokens.global.md.sys["border-radius"].value}px`,
          borderRadius: "20px",
          backgroundColor:
            tokens.global.md.sys.color["pressed-button-color"].value,
          color: "black",
          boxShadow:
            "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
          fontFamily: `${tokens.global.md.sys.typescale["button-text"].value.fontFamily}, sans-serif`,
          fontWeight: 400,
          fontSize: "12px",
          letterSpacing: "0.5px",
          textTransform: "none",
          "&:hover": {
            backgroundColor:
              tokens.global.md.sys.color["enabled-button-color"].value,
          },
        },
      },
    },
  },
});

export default theme;
