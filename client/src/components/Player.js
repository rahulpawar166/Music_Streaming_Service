// // import { useState, useEffect } from "react"
// // import SpotifyPlayer from "react-spotify-web-playback"

// // export default function Player({  trackUri }) {
// //   const [play, setPlay] = useState(false)

// //   useEffect(() => setPlay(true), [trackUri])

// //   return (
// //     <SpotifyPlayer
// //       token="BQAnKex5Bq2G-Df2IPID0B4fk_srsj496nadU3enUBQO4SXmlRTPZ-ey9fLoGPVQfHIyIc85dl15enPtNPVjxFDPyADCiTP_2oabKFIE8wMe7Ix2XAOjvAENpGgEcvngjz1lTOpjkn5_5edQiMSwGhbviP9gPxRjE_g8gxMb8NRiKVFakUqiPIXjHZ9a2Lk0nvc"
// //       showSaveIcon
// //       callback={state => {
// //         if (!state.isPlaying) setPlay(false)
// //       }}
// //       play={play}
// //       uris={trackUri ? [trackUri] : []}
// //     />
// //   )
// // }

// const NewRelease = () => {

//   const [musicAlbums, setMusicAlbums] = useState([]);
//   const classes = useStyles();
//   const [loading, setLoading] = useState(true);
//   const [found, setFound] = useState(false);

//   console.log(
//     "accessstoken from new release=",
//     window.localStorage.getItem("token")
//   );
// const Player = async () => {
//   const requestInit = {
//     headers: {
//       Authorization: `Bearer "BQBGflZkbHteL4xFmtc6PJ7levEIaxj4ydBo-qSgrq_6refsp0YIZtoX_8AeLiBXUVWjEjyoiAcVuGHApVHgkT73HJUuxz_7GClJnYSNs3ZfkUMqYW8KeNMN2cmZevz65Jh-GitBIzyRCAcTk27xHgq-AgsATH2jB_2F9p_-O1ilNivqC6rCCbObvhkJKA"`,
//       "Content-Type": "application/json",
//     },
//   };

//   try {
//     const response = await axios.get(
//       `${process.env.REACT_APP_NEW_RELEASE}`,
//       requestInit
//     );
//     console.log("we get response");
//     console.log(response);
//     setLoading(false);
//     setFound(true);
//     setMusicAlbums(response.data.albums.items);
//     // console.log(musicAlbums);
//   } catch (error) {
//     setFound(false);
//     setLoading(false);
//     console.log(error);
//   }
// };

// useEffect(() => {
//   getNewMusicAlbumReleases();
// }, []);

// const buildCard = (album) => {
//   return (
//     <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={album?.id}>
//       <Card className={classes.card} variant="outlined">
//         <CardActions>
//           <Link to={`/${album?.id}`}>
//             <CardHeader className={classes.titleHead} title={album?.name} />

//             <CardMedia
//               className={classes.media}
//               component="img"
//               image={album?.images[0]?.url}
//               title="character image"
//             />
//           </Link>
//         </CardActions>
//         <Button className={classes.button}>Add</Button>
//       </Card>
//     </Grid>
//   );
// };

// if (loading) {
//   return (
//     <div>
//       <h2> {"Loading please wait for few second"}</h2>
//       <h2> {"................................."}</h2>
//     </div>
//   );
// } else if (!found) {
//   return <h1>404: not enough data for this page</h1>;
// } else
//   return (
//     <div>
//       <h1>New Released Albums</h1>
//       <br />
//       <Grid container className={classes.grid} spacing={5}>
//         {musicAlbums?.map((album) => buildCard(album))}
//       </Grid>

//     </div>
//   );
// };

// export default NewRelease;
