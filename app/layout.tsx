import AuthContextProvider from "@/firebase/authContext";
import { ThemeProvider } from "@mui/material/styles";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "./components/Navbar";
import { TimerProvider } from "./context/TimerContext";
import { ClefProvider } from "../app/context/ClefContext";
import "./styles/globals.css";
import theme from "./theme";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "LAFSMW Theory Test",
  description: "Authored by Kasey Knudsen and Brett Eastman",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-WYES3RTNHV" />
      <body className={poppins.className}>
        <AuthContextProvider>
          <ThemeProvider theme={theme}>
            <TimerProvider>
              <ClefProvider>
                <Navbar />
                {children}
              </ClefProvider>
            </TimerProvider>
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
