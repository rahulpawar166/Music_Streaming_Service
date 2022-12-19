import { useState, useContext } from "react";
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

const CreatePlaylistPopup = (props) => {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleCreate = async () => {
    props.handleClose();
    try {
      const userToken = await currentUser.getIdToken();
      console.log(userToken);
      const { data } = await axios.post(
        "http://localhost:3008/playlists/create",
        {
          name: name,
          public: isPublic,
        },
        {
          headers: {
            FirebaseIdToken: userToken,
          },
        },
      );
      if (!data) throw "Playlist creation request failed!";
    } catch (e) {
      console.error(e);
    }
    setName("");
    setIsPublic(false);
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle>Create a New Playlist</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => setName(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          }
          label="Make public?"
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={props.handleClose}
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePlaylistPopup;
