import { useState, useEffect } from "react"
import axios from "axios";
// import { Link } from "react-router-dom";
// import {
//   Card,
//   CardActions,
//   CardHeader,
//   CardMedia,
//   Grid,
//   makeStyles,
//   Button,
// } from "@material-ui/core";


const Lyrics = () => {

const [playingTrack, setPlayingTrack] = useState()
const [lyrics, setLyrics] = useState("")

function chooseTrack(track) {
    setPlayingTrack(track)
    
    setLyrics("")
  }


  useEffect(() => {
    if (!playingTrack) return

    axios
      .get(`http://localhost:3008/lyrics/${playingTrack.title}/${playingTrack.artist}`, {
       
      })
      .then(res => {
        setLyrics(res.data.lyrics)
      })
  }, [playingTrack])

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
    
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  )

}

export default Lyrics
