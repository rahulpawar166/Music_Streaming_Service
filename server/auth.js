const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = {
  type: process.env.EXPRESS_APP_TYPE,
  project_id: process.env.EXPRESS_APP_PROJECT_ID,
  private_key_id: process.env.EXPRESS_APP_PRIVATE_KEY_ID,
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCh2JUwCP+sP7pQ\nLMALbtVWlSyvBaKeX+O0IEyHeBumOuvKNGsbKwChnghO04RD89La1L/U1AWeoqhR\nYzlrzHeXaxCh70KJRpmaJzkKBoGxDFHN7WofcGhzkOv3NkgouhRylInYaNsa1eE2\nWXVFKgG20D0+38mUhSasQTRP/0QEs6SuI9f2FrPb6YNLvuRY4Hrby+XqdOVpuu/s\nhrx3Gwu4YveRAuzxliQkBwnkUiZrOJjf8WflCEKB8cffLkNHzhTfZ3w+RpwfXo9E\nUnPPl+00nt+rlRh6eAD+2gNe0ReWqNzdsa4S67cEdFFFweMcx4SejlTgXXBCJQM4\n6yhzcoRpAgMBAAECggEABqIyxIlsjU9UCsriw4qIlP1qm5ver/YchlACmFTccUJI\nqCeLh6K0v8Bon8PR+oUJDJjGv2mXTLVnB7r06g2zOHzAwu+5vu2qsw5OK10xPflU\nIF14SY9DwLoyacC1pscFuofgZIMxDoGwsu0Uvj/RWoBg2kMK50WpMaCUjSjYeAbM\n3cHUPShg3igxpiGxpVjahieM/PI+CpJFWWzZFpGr6DEhoOjJeeWEtI7gJdwBbjBI\nPZPa4OMsNOaWSauIp5ZcKKxTOKqIv+7V2KbzhKyRodtsmjhXYFZnQsrcUC5UiwJ4\nK43MrWcGevjUBwlAqqsFIu1kWVt8ow32CNZi5oLQDwKBgQDc4hhzNMbvCPGMnn5g\nogTLhVmLRFkRRW3ZoNXwi4Hljyhu2xb+yrgBkvwsmfDvqksv0HO2TmKRRHBwmSUT\nbN74nDtK3Rgh6i4AAmXOugMliZEvUKn4QK4aprLkGNQfcS/x4QRsAZVMvgqVTZcu\nq5b0IzgERr8wTwZY/k4crWFjCwKBgQC7k6+V1mToZoohHoDBDcZNOO1omFz0Ijz9\nCZxicY3DO8sP+T7SuAPNQ1S4dxwjoHjou3zzjAAL7hb7BwaZQ8gr56KySzSqCYRR\n/qTRVzR2fi0cakSC0M0xufAnavfNNjJkctbycEmr7Fqc5ctVs9ow1ZITR9DrebXO\no1fdc0ae2wKBgGMfS12X15Y5azxxe8EdtA0pAHAQ8e9gOtWo6ZkS4e4Eel6VDxK0\nIjMCpQvW4VqMD0Wbw/GR54XNMrA06YB4IO9sHOeRpFzD3HTAnrNQokzcGT0kc8Im\nNHtdR3Y49ihOAPgIxJU7eKaBufoaYbfd5NYWX/L7VJz3OaACL0eLPuLVAoGARsZ6\nwfabLHVEOSrhOfaQlCKesZCLwjIJARDXSO2/p6KwA97vrWJxTMnS9ac7ntW1yVq0\n0tBIVDgJw73q53mD1c0Yvl1SCbZ9jtKeLb7RtMP3EXmnUBSo19JoovbheTSx3uTV\n5bQomA4eQoUSK8woz7RF4bB/S9ool0dap9wPEXECgYAdd8IPBz2Euu2Ky26c8uN7\nMcmp+LpbE4udFIQ4owgYAtQn/9wAH7Z3Me7lduixOkEHSQx0Vp6HB2jAqIegJjGa\nQ7ZjELR47mRV6TaabNY4vFt2mfnLRzQhl9ZPPwndmN49AiqyY/VIX1xduWoHowxW\nZLSau8b5FnMCg+BJOWg4PQ==\n-----END PRIVATE KEY-----\n",
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
