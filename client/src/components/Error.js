import { makeStyles } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const useStyles = makeStyles((theme) => ({
  errorPaper: {
    padding: theme.spacing(2),
    margin: "0 auto",
    maxWidth: "80%",
  },
}));

const Error = (props) => {
  const classes = useStyles();
  let errorMessage =
    props.message ||
    "Error 500: Something went wrong, we're not sure what. Try refreshing the page?";
  return (
    <Paper className={classes.errorPaper}>
      <Typography variant="h2">{errorMessage}</Typography>
    </Paper>
  );
};

export default Error;
