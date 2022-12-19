import axios from "axios";
import { AuthContext } from "../firebase/Auth";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Error from "./Error";
import Loading from "./Loading";

const Lyrics = () => {
  const { artist, trackName } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [lyricsData, setLyrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.get(
          `http://localhost:3008/lyrics/${artist}/${trackName}`,
        );
        setLyrics(data);
        setLoading(false);
        setError(null);
      } catch (e) {
        setLoading(false);
        setError(e);
        console.error(e);
      }
    };
    if (currentUser) fetchLyrics();
  }, [artist, trackName]);

  if (loading) return <Loading />;
  else if (error) return <Error message={error} />;
  else
    return (
      <div>
        <h1>Lyrics</h1>
        <p className="lyrics">{lyricsData}</p>
      </div>
    );
};
export default Lyrics;
