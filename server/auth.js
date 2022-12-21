const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = {
  type: process.env.EXPRESS_APP_TYPE,
  project_id: process.env.EXPRESS_APP_PROJECT_ID,
  private_key_id: process.env.EXPRESS_APP_PRIVATE_KEY_ID.replace(/\n/g, '\n'),
  private_key: process.env.EXPRESS_APP_PRIVATE_KEY,
  client_email: process.env.EXPRESS_APP_CLIENT_EMAIL,
  client_id: process.env.EXPRESS_APP_CLIENT_ID,
  auth_uri: process.env.EXPRESS_APP_AUTH_URI,
  token_uri: process.env.EXPRESS_APP_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.EXPRESS_APP_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.EXPRESS_APP_CLIENT_X509_CERT_URL,
};

initializeApp({
  credential: cert(serviceAccount),
});

module.exports = async (req, res, next) => {
  try {
    let idToken = req.header("FirebaseIdToken");
    if (!idToken) throw "Missing FirebaseIdToken header!";
    const { uid } = await getAuth().verifyIdToken(idToken);
    if (!uid) throw "Invalid FirebaseIdToken!";
    req.firebaseUid = uid;
    next();
  } catch (e) {
    return res.status(401).json({ error: e.message || "Unauthorized" });
  }
};
