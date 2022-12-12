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

async function doSignUp(data) {
  await createUserWithEmailAndPassword(auth, data.email, data.password);
  await updateProfile(auth.currentUser, { displayName: data.name });
  return;
}

async function doSignIn(data) {
  await signInWithEmailAndPassword(auth, data.email, data.password);
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
