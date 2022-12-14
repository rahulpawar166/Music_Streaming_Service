import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  stickyFooter: {
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const Player = () => {
  const classes = useStyles();
  return (
    <footer className={classes.stickyFooter}>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
        </Grid>
      </Box>
    </footer>
  );
};

export default Player;
