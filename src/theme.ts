import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    info: {
      main: "#17a2b8",
      light: "#36cee6",
      dark: "#0f6674",
      contrastText: "#FFF",
    },
  },
});
