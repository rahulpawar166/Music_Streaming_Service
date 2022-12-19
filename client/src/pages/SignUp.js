import "../styles/UserAuth.css";
import { useState, useContext, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Container } from "@mui/system";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { doSignUp } from "../firebase/FirebaseFunctions";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import Iconify from "../components/Iconify";
import SocialSignIn from "../components/SocialSignIn";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .required("First name required"),

    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Should contain more than 5 characters")
      .max(20, "should be less than 20 characters"),
    repeatPassword: Yup.string()
      .required("Password is required")
      .min(5, "Should contain more than 5 characters")
      .max(20, "should be less than 20 characters")
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Both password need to be the same",
        ),
      }),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
    validationSchema: RegisterSchema,
  });

  const { errors, touched, isSubmitting, getFieldProps, handleChange, values } =
    formik;

  const handleSubmit = async () => {
    console.log("Submitting");
    console.log("Username is: ", values.username);
    console.log("Email is: ", values.email);
    console.log("Password is: ", values.password);
    console.log("Repeat password is: ", values.repeatPassword);
    if (
      !values.email ||
      !values.password ||
      !values.username ||
      !values.repeatPassword
    )
      notifyPopup("Please fill in every field!", "error");
    else if (values.password !== values.repeatPassword)
      notifyPopup("Your passwords do not match!", "error");
    else {
      console.log("Submitting_1");
      try {
        await doSignUp(values.email, values.password, values.username);
        navigate("/");
      } catch (error) {
        console.log(error);
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
        <br />
        <br />
        <SocialSignIn />
        <br />
        <br />
        <Container maxWidth="sm">
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <p className="login-text">Username</p>
              <TextField
                label="Username"
                variant="outlined"
                className="text-field"
                onChange={(e) => setUsername(e.target.value)}
                {...getFieldProps("username")}
                id="username"
                value={values.username}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
              />
              <p className="login-text">Email</p>
              <TextField
                label="Email"
                variant="outlined"
                className="text-field"
                onChange={(e) => setEmail(e.target.value)}
                {...getFieldProps("email")}
                id="email"
                type="email"
                value={values.email}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />

              <p className="login-text">Password</p>
              <TextField
                label="Password"
                variant="outlined"
                className="text-field"
                onChange={(e) => setPassword(e.target.value)}
                {...getFieldProps("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
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
              <p className="login-text">Confirm Password</p>
              <TextField
                label="Confirm Password"
                variant="outlined"
                className="text-field"
                onChange={(e) => setRepeatPassword(e.target.value)}
                id="confirmPassword"
                {...getFieldProps("repeatPassword")}
                type={showConfirmPassword ? "text" : "password"}
                value={values.repeatPassword}
                InputProps={{
                  endAdornment: (
                    <label htmlFor="see-confirmPassword">
                      <InputAdornment position="end">
                        <IconButton
                          id="see-confirmPassword"
                          edge="end"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          <Iconify
                            icon={
                              showConfirmPassword
                                ? "eva:eye-fill"
                                : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    </label>
                  ),
                }}
                error={Boolean(touched.repeatPassword && errors.repeatPassword)}
                helperText={touched.repeatPassword && errors.repeatPassword}
              />
              <br />
              <Button
                variant="contained"
                className="btn"
                onClick={handleSubmit}
              >
                Sign Up
              </Button>
              <p>
                Already have an account?{" "}
                <Button
                  className="smallBtn"
                  onClick={() => navigate("/signin")}
                >
                  Login
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

export default SignUp;
