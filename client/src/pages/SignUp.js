import "../styles/UserAuth.css";
import { useState, useContext, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { TextField, Button } from "@mui/material";
import { Container } from "@mui/system";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { doSignUp } from "../firebase/FirebaseFunctions";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignUp = (props) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  if (currentUser) navigate("/");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [popupDetails, setPopupDetails] = useState({
    shown: false,
    message: "",
    variant: "",
  });

  const notifyPopup = (message, variant) => {
    setPopupDetails({
      shown: false,
      message: message,
      variant: variant,
    });
  };

  const closeNotification = (e, reason) => {
    if (reason === "clickaway") return;
    setPopupDetails({
      shown: false,
      message: "",
      variant: "",
    });
  };

  const handleSubmit = async () => {
    if (!email || !password || !username || !repeatPassword)
      notifyPopup("Please fill in every field!", "error");
    else if (password !== repeatPassword)
      notifyPopup("Your passwords do not match!", "error");
    else {
      try {
        await doSignUp({ email, password, name: username });
        navigate("/");
      } catch (error) {
        notifyPopup(error || "Couldn't sign up!", "error");
      }
    }
  };

  return (
    <div className="container">
      <Snackbar
        open={popupDetails.shown}
        autoHideDuration={2000}
        onClose={closeNotification}
      >
        <Alert
          onClose={closeNotification}
          severity={popupDetails.variant}
          sx={{ width: "100%" }}
        >
          {popupDetails.message}
        </Alert>
      </Snackbar>
      <div className="card">
        <h1>Sign Up</h1>
        <Container maxWidth="sm">
          <p className="login-text">Username</p>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            className="text-field"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <p className="login-text">Email</p>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            className="text-field"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <p className="login-text">Password</p>
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            className="text-field"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <p className="login-text">Confirm Password</p>
          <TextField
            id="outlined-basic"
            label="Confirm Password"
            variant="outlined"
            className="text-field"
            onChange={(e) => setRepeatPassword(e.target.value)}
            value={repeatPassword}
          />
          <Button variant="contained" className="btn" onClick={handleSubmit}>
            Sign Up
          </Button>
          <p>
            Already have an account?{" "}
            <Button className="smallBtn" onClick={() => navigate("/signin")}>
              Login
            </Button>
          </p>
        </Container>
      </div>
      <div className="blob"></div>
    </div>
  );
};

export default SignUp;
