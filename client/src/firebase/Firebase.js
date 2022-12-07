// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import firebaseui, { auth } from "firebaseui";

const firebaseConfig = {
  apiKey: "AIzaSyCOVsUCQUSC1LjhUobvLMG1ZlnrLNfbPWQ",
  authDomain: "music-streaming-effd2.firebaseapp.com",
  projectId: "music-streaming-effd2",
  storageBucket: "music-streaming-effd2.appspot.com",
  messagingSenderId: "128931379550",
  appId: "1:128931379550:web:90507e79fdbbfc486337cf",
};

function Auth() {
  return getAuth();
}
const moment = require("moment");
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function AppUserDb(username, uid) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      username: username,
      uid: uid,
    });

    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function AppUserCreation(data) {
  console.log("data in fb", data);
  console.log("auth", getAuth());
  let user;
  try {
    let user = await createUserWithEmailAndPassword(
      getAuth(),
      data.email,
      data.password,
      data.name
    );
    if (user.user) {
      updateProfile(getAuth().currentUser, {
        displayName: data.name,
      });
      AppUserDb(data.name, null, user.user.uid);
      console.log("user", user);
      return true;
    }
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function AppUserLogout() {
  let user;
  try {
    user = await signOut(getAuth()).then((res) => {});
    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function AppUserLogin(data) {
  console.log("userlogin", data);
  console.log("auth", getAuth());
  let user;
  try {
    user = await signInWithEmailAndPassword(
      getAuth(),
      data.email,
      data.password
    );
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function doPasswordReset(email) {
  await sendPasswordResetEmail(getAuth(), email);
}

export { AppUserCreation, AppUserLogin, AppUserLogout, Auth, doPasswordReset };
