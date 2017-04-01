// Generated with https://cimdalli.github.io/mui-theme-generator/
import getMuiTheme from "material-ui/styles/getMuiTheme";
import baseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import {
  indigo600,
  indigo500,
  deepOrange500,
  grey500
} from "material-ui/styles/colors";

export default () => {
  const overwrites = {
    palette: {
      primary1Color: indigo600,
      accent1Color: deepOrange500,
      primary2Color: indigo600,
      primary3Color: grey500,
      pickerHeaderColor: indigo500
    }
  };
  return getMuiTheme(baseTheme, overwrites);
};
