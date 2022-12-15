import { useContext } from "react";
import { AuthContext } from "../firebase/Auth";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import axios from "axios";

const Account = () => {
  const { currentUser } = useContext(AuthContext);

  const spotifyAuthorizationFlow = () => {
    const rand = Math.random().toString().substring(2, 18);

    const config = {
      headers: {
        Authorization: `Basic ${new Buffer(
          process.env.REACT_APP_CLIENT_ID +
            ":" +
            process.env.REACT_APP_CLIENT_SECRET,
        ).toString("base64")}`,
      },
      form: {
        grant_type: "client_credentials",
      },
      json: true,
    };
    const url = "https://accounts.spotify.com/api/token";
    const response = axios.get("https://accounts.spotify.com/api/token");
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={spotifyAuthorizationFlow}
      >
        Connect your Spotify
      </Button>
    </Box>
  );
};

export default Account;
