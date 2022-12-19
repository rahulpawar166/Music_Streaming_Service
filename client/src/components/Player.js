import { useContext } from "react";
import PlayerContext from "./PlayerContext";
import SpotifyPlayer from "react-spotify-web-playback";
import Error from "./Error";

export default function Player({ accessToken }) {
  const [playingTrack, setPlayingTrack] = useContext(PlayerContext);

  if (!accessToken) return <Error />;
  if (!playingTrack) return <Error />;
  return (
    <SpotifyPlayer
      token={accessToken}
      play={true}
      uris={playingTrack ? [playingTrack.uri] : []}
    />
  );
}
