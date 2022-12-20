import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#283593",
      light: "#5f5fc4",
      dark: "#001064",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#5c6bc0",
      light: "#8e99f3",
      dark: "#26418f",
      contrastText: "#ffffff",
    },
  },
});

export default theme;
