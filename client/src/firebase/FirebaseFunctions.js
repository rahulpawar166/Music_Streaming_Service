import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
} from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

async function doSignUp(email, password, username) {
  await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(auth.currentUser, { displayName: username });
  return;
}

async function doSignIn(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
  return;
}

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === "google") {
    socialProvider = new GoogleAuthProvider();
  }
  await signInWithPopup(auth, socialProvider);
  return;
}

async function doSignOut() {
  await signOut(auth);
  return;
}

async function doPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
  return;
}

async function doUpdateProfilePicture(url) {
  if (user !== null) {
    await updateProfile(user, { photoURL: url });
    return;
  }
}

async function doDeleteUser() {
  if (user !== null) {
    await deleteUser(user);
    return;
  }
}

export {
  doSignUp,
  doSignIn,
  doSocialSignIn,
  doSignOut,
  doPasswordReset,
  doUpdateProfilePicture,
  doDeleteUser,
};
