import { Button, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { doPasswordReset } from "../firebase/FirebaseFunctions";
import "../styles/UserAuth.css";

const ForgotPassword = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const ForgorPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgorPasswordSchema,
  });
  const { errors, touched, values, isSubmitting, getFieldProps, handleChange } =
    formik;

  const forgotPassword = async (e) => {
    e.preventDefault();
    try {
      if (values.email) {
        await doPasswordReset(values.email);
        navigate("/signin");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="container">
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
            className={classes.textfield}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            {...getFieldProps("email")}
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
