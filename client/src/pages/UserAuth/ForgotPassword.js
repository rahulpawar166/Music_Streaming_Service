import { TextField, Button } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import { StyledEngineProvider } from "@mui/system";
import "../../App.css";
import "./UserAuth.css";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doPasswordReset } from "../../firebase/Firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const forgotPassword = async (e) => {
    e.preventDefault();
    try {
      if (email) {
        await doPasswordReset(email);
        console.log("Success");
        toast.message("Password reset email was sent");
      } else {
        console.log("Fail");
        toast.error(
          "Please enter an email address before you click the forgot password link"
        );
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
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
