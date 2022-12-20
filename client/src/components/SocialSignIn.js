import React from "react";
import { doSocialSignIn } from "../firebase/FirebaseFunctions";
import googleBtn from "../icons/sign_in_google.png";
import "../styles/UserAuth.css";
import { useNavigate } from "react-router-dom";

const SocialSignIn = () => {
  const navigate = useNavigate();
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img
        onClick={() => socialSignOn("google")}
        alt="google signup"
        src={googleBtn}
        className="googleBtn"
      />
    </div>
  );
};

export default SocialSignIn;
