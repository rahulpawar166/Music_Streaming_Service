// React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Auth
import { Auth, AppUserLogout } from "../../firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
// Lists
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// Icons
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import AlbumIcon from "@material-ui/icons/Album";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const NavigationMenu = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = Auth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("userinnavbar", user);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoading(false);
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    });
  }, []);

  const handleSignOut = () => {
    AppUserLogout();
    localStorage.removeItem("user");
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
    buildNavItem("New Releases", "newreleases", "/new-release", <AlbumIcon />),
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
      {user ? (
        <ListItem button onClick={handleSignOut} key="signout">
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Sign On" />
        </ListItem>
      ) : (
        <ListItem button onClick={() => navigate("/userauth")} key="signin">
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
