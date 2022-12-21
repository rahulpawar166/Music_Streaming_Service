import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Checkbox from "@material-ui/core/Checkbox";
import DialogTitle from "@mui/material/DialogTitle";
import { AuthContext } from "../firebase/Auth";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const AddPlaylistPopup = (props) => {
  const [value, setValue] = useState("");
  const [allPlayListData, setAllPlayListData] = useState();
  const { currentUser } = useContext(AuthContext);

  const handleChange = async (event) => {
    // debugger;
    console.log("set value called");
    setValue(event.target.value);
    console.log(value);
  };

  const handleCreate = async () => {
    props.handleClose();
    try {
      const userToken = await currentUser.getIdToken();
      console.log("playlist value=", value, props.track);
      const { data } = await axios.post(
        `http://localhost:3008/playlists/addto/${value}`,
        {
          track: props.track,
        },
        {
          headers: {
            FirebaseIdToken: userToken,
          },
        },
      );
      if (!data) throw "Add to Playlist request failed!";
    } catch (error) {
      console.log("error", error);
    }
    setValue("");
  };

  const getPlaylistName = async () => {
    const userToken = await currentUser.getIdToken();
    try {
      const { data } = await axios.get(
        `http://localhost:3008/playlists/owned`,
        {
          headers: {
            FirebaseIdToken: userToken,
          },
        },
      );
      if (!data) setAllPlayListData([]);
      setAllPlayListData(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (currentUser) getPlaylistName();
  }, [currentUser]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>Add to Playlist</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {allPlayListData?.length > 0 ? "Select Playlist" : "No Playlists"}
          </FormLabel>
          <RadioGroup
            aria-label="playlist"
            name="playlist"
            value={value}
            onChange={handleChange}
          >
            {allPlayListData?.length > 0 &&
              allPlayListData?.map((element) => {
                return (
                  <FormControlLabel
                    value={element._id}
                    control={<Radio />}
                    label={element?.name}
                  />
                );
              })}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={props.handleClose}
        >
          Cancel
        </Button>
        {allPlayListData?.length > 0 && (
          <Button variant="contained" color="primary" onClick={handleCreate}>
            ADD
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddPlaylistPopup;
