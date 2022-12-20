import "../styles/UserAuth.css";
import "../styles/App.css";
import { useState, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Container } from "@mui/system";
import { doSignIn } from "../firebase/FirebaseFunctions";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import Iconify from "../components/Iconify";
import SocialSignIn from "../components/SocialSignIn";

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
  const [showPassword, setShowPassword] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Should contain more than 5 characters")
      .max(20, "should be less than 20 characters"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
  });
  const { errors, touched, values, isSubmitting, getFieldProps, handleChange } =
    formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

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
    if (!values.email || !values.password)
      notifyPopup("Please fill in every field!", "error");
    else {
      try {
        await doSignIn(values.email, values.password);
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
        <br />
        <br />
        <SocialSignIn />
        <br />
        <Container maxWidth="sm">
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <p className="subtitle">Email</p>
              <TextField
                key="email"
                id="email"
                label="Email"
                variant="outlined"
                className="text-field"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              <p className="login-text">Password</p>
              <TextField
                key="password"
                id="password"
                label="Password"
                variant="outlined"
                className="text-field"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                {...getFieldProps("password")}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <label htmlFor="see-password">
                        <IconButton
                          id="see-password"
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          <Iconify
                            icon={
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </label>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />

              <Button
                className="smallBtn displayBlock"
                onClick={() => navigate("/forgotpassword")}
              >
                Forgot Password?
              </Button>
              <br />
              <Button
                variant="contained"
                className="btn displayBlock"
                onClick={handleSubmit}
              >
                Login
              </Button>
              <br />
              <p className="subtitle">
                Don't have an account?{" "}
                <Button
                  className="smallBtn"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Button>
              </p>
            </Form>
          </FormikProvider>
        </Container>
      </div>
      <div className="blob"></div>
    </div>
  );
};

export default SignIn;
