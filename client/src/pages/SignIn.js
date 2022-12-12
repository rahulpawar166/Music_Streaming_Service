import "../styles/UserAuth.css";
import { useState, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { Container } from "@mui/system";
import { doSignIn } from "../firebase/FirebaseFunctions";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignIn = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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
    if (!email || !password)
      notifyPopup("Please fill in every field!", "error");
    else {
      try {
        await doSignIn({ email, password });
        navigate("/");
      } catch (error) {
        notifyPopup(error || "Couldn't sign in!", "error");
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
        <h1>Login</h1>
        <Container maxWidth="sm">
          <p className="subtitle">Email</p>
          <TextField
            key="email"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            className="text-field"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <p className="login-text">Password</p>
          <TextField
            key="password"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            className="text-field"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <Button
            variant="contained"
            className="btn displayBlock"
            onClick={handleSubmit}
          >
            Login
          </Button>
          <Button
            className="smallBtn displayBlock"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot Password?
          </Button>
          <p className="subtitle">
            Don't have an account?{" "}
            <Button className="smallBtn" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </p>
        </Container>
      </div>
      <div className="blob"></div>
    </div>
  );
};

export default SignIn;
