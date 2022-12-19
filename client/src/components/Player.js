import { useContext, useEffect, useState } from "react";
import PlayerContext from "./PlayerContext";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({ accessToken }) {
  const [playingTrack, setPlayingTrack] = useContext(PlayerContext);
  const [play, setPlay] = useState(true);
  useEffect(() => setPlay(true), [playingTrack]);

  if (!accessToken) return <></>;
  return (
    <SpotifyPlayer
      token={accessToken}
      uris={playingTrack ? [playingTrack.uri] : []}
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
      }}
      play={play}
      autoPlay={true}
    />
  );
}
