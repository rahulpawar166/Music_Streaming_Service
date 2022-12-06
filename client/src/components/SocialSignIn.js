import React from "react";
import { doSocialSignIn } from "../firebase/FirebaseFunctions";

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
        alt="google signin"
        src="/icons/sign_in_google.png"
      />
      <img
        onClick={() => socialSignOn("facebook")}
        alt="facebook signin"
        src="/icons/sign_in_facebook.png"
      />
    </div>
  );
};

export default SocialSignIn;
