import "../styles/UserAuth.css";
import { TextField, Button } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Container } from "@mui/system";
import { useState, forwardRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { doPasswordReset } from "../firebase/FirebaseFunctions";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ForgotPassword = () => {
  const navigate = useNavigate();
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

  const forgotPassword = async (e) => {
    e.preventDefault();
    try {
      if (email) {
        await doPasswordReset(email);
        notifyPopup("Password reset email was sent!", "success");
      } else {
        notifyPopup("Please enter an email address!", "error");
      }
    } catch (error) {
      console.error(error.message);
      notifyPopup(
        error.message || "Request to reset password failed!",
        "error",
      );
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
        <h1>Forgot Password</h1>
        <Container maxWidth="sm">
          <p className="subtitle">
            Please enter your valid email address to get password reset link
          </p>
          <TextField
            key="email"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            className="text-field"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <Button variant="contained" className="btn" onClick={forgotPassword}>
            Send Reset Link!
          </Button>
        </Container>
      </div>
      <div className="blob"></div>
    </div>
  );
};

export default ForgotPassword;
