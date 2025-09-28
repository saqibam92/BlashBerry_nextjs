// apps / client / src / components / ThemeRegistry / theme.js;

import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5", // A nice indigo color
    },
    secondary: {
      main: "#F97316", // A vibrant orange
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

export default theme;
