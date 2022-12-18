import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import { useNavigate } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import AlbumIcon from "@material-ui/icons/Album";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const NavigationMenu = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const buildNavItem = (text, key, link, icon) => {
    return {
      text: text,
      link: link,
      key: key,
      icon: icon,
    };
  };

  const NavItems = [
    buildNavItem("Search", "search", "/search", <SearchIcon />),
    buildNavItem("New Releases", "newreleases", "/new-releases", <AlbumIcon />),
    buildNavItem("Home", "home", "/", <HomeIcon />),
    buildNavItem("Library", "playlists", "/playlists", <LibraryMusicIcon />),
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
      <ListItem
        button
        onClick={() => navigate(currentUser ? "/account" : "/signin")}
        key={currentUser ? "account" : "signin"}
      >
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary={currentUser ? "Profile" : "Sign In"} />
      </ListItem>
    </List>
  );
};

export default NavigationMenu;
