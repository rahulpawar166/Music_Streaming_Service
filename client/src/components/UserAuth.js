import { TextField, Button } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import { StyledEngineProvider } from "@mui/system";
import "../App.css";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppUserCreation, AppUserLogin } from "../firebase/Firebase";

const Login = (props) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email === "" || password === "") {
      toast.error("Please fill all the fields");
    } else {
      AppUserLogin({ email, password }).then((res) => {
        if (res === true) {
          const id = toast.loading("Logging In...");
          localStorage.setItem("user", JSON.stringify(res));
          setTimeout(() => {
            toast.update(id, {
              render: "Logged In",
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
            navigate("/");
          }, 1000);
        } else {
          toast.error(res.message);
        }
      });
    }
  };
  return (
    <div className="login-div">
      <h1>Login</h1>
      <Container maxWidth="sm">
        <p className="login-text">Email</p>
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
          className="login-button"
          onClick={() => handleSubmit()}
        >
          Login
        </Button>
        <p>
          Don't have an account?{" "}
          <Button
            className="switch-form"
            onClick={() => {
              props.setSwitchForm(false);
            }}
          >
            Sign up
          </Button>
        </p>
      </Container>
    </div>
  );
};
const SignUp = (props) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const handleSubmit = () => {
    if (
      email === "" ||
      password === "" ||
      username === "" ||
      repeatPassword === ""
    ) {
      toast.error("Please fill all the fields");
    } else if (password !== repeatPassword) {
      toast.error("Passwords don't match");
    } else {
      AppUserCreation({ email, password, name: username }).then((res) => {
        if (res === true) {
          const id = toast.loading("Creating Account...");
          setTimeout(() => {
            toast.update(id, {
              render: "Signed In",
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
            navigate("/");
          }, 1000);
        } else {
          toast.error(res.message);
        }
      });
    }
  };
  return (
    <div className="login-div">
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
        <Button
          variant="contained"
          className="login-button"
          onClick={() => handleSubmit()}
        >
          Sign Up
        </Button>
        <p>
          Already have an account?{" "}
          <Button
            className="switch-form"
            onClick={() => {
              props.setSwitchForm(true);
            }}
          >
            Login
          </Button>
        </p>
      </Container>
    </div>
  );
};
const UserAuth = ({ user }) => {
  const [switchForm, setSwitchForm] = useState(true);

  if (user) {
    return <Navigate to="/" replace />;
  }
  return (
    <div>
      <StyledEngineProvider injectFirst>
        {switchForm ? (
          <Login switchForm={switchForm} setSwitchForm={setSwitchForm} />
        ) : (
          <SignUp switchForm={switchForm} setSwitchForm={setSwitchForm} />
        )}
      </StyledEngineProvider>
    </div>
  );
};

export default UserAuth;
