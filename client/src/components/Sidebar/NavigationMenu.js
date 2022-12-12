import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doSignOut } from "../../firebase/FirebaseFunctions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import AlbumIcon from "@material-ui/icons/Album";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const NavigationMenu = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleSignOut = () => {
    doSignOut();
    toast.info("Logged Out");
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const buildNavItem = (text, key, link, icon) => {
    return {
      text: text,
      link: link,
      key: key,
      icon: icon,
    };
  };

  const NavItems = [
    buildNavItem("Home", "home", "/", <HomeIcon />),
    buildNavItem("Search", "search", "/search", <SearchIcon />),
    buildNavItem("New Releases", "newreleases", "/new-releases", <AlbumIcon />),
    buildNavItem("Library", "library", "/library", <LibraryMusicIcon />),
  ];

  return (
    <List>
      {NavItems.map((item) => {
        return (
          <ListItem button onClick={() => navigate(item.link)} key={item.key}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        );
      })}
      {currentUser ? (
        <ListItem button onClick={handleSignOut} key="signout">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>
      ) : (
        <ListItem button onClick={() => navigate("/signin")} key="signin">
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Sign In" />
        </ListItem>
      )}
    </List>
  );
};

export default NavigationMenu;
