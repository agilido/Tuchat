import { createMuiTheme } from "@material-ui/core/styles";
const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#003D7B",
    }, //#003D7B
    secondary: {
      main: "#FFFFFF",
    },
  },
  typography: {
    h6: {
      fontFamily: "Pacifico, cursive",
    },
  },
});

export default defaultTheme;
