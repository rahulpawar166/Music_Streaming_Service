import React from "react";
import { doSocialSignIn } from "../firebase/FirebaseFunctions";
import googleBtn from "../icons/sign_in_google.png";
import "../styles/UserAuth.css";

const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
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
