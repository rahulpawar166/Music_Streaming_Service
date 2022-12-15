import "../styles/UserAuth.css";
import { TextField, Button } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Container } from "@mui/system";
import { useState, forwardRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { doPasswordReset } from "../firebase/FirebaseFunctions";
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

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

  const ForgorPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: ForgorPasswordSchema,
  });
  const { errors, touched, values, isSubmitting, getFieldProps, handleChange } = formik;


  const forgotPassword = async (e) => {
    e.preventDefault();
    try {
      if (values.email) {
        await doPasswordReset(values.email);
        notifyPopup("Password reset email was sent!", "success");
        navigate("/signin");
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
              id="email"
              label="Email"
              variant="outlined"
              className="text-field"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
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
