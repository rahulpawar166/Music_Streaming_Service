import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import NavigationMenu from "./NavigationMenu";
import PlaylistList from "./PlaylistList";

const drawerWidth = "12rem";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawerButton: {
    width: "100%",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
  },
}));

const Sidebar = () => {
  const theme = useTheme();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      anchor="left"
    >
      <div className={classes.toolbar}>
        <IconButton
          className={classes.drawerButton}
          onClick={handleDrawerToggle}
        >
          {!open ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Divider />
      <NavigationMenu />
      <Divider />
      {/* <PlaylistList /> */}
    </Drawer>
  );
};

export default Sidebar;
