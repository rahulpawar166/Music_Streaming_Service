const express = require("express");
const process = require("process");
const admin = require("firebase-admin");
const cors = require("cors");
const compression = require("compression");
const app = express();
const PORT = 3008;
const serviceAccount = {
  type: process.env.EXPRESS_APP_TYPE,
  project_id: process.env.EXPRESS_APP_PROJECT_ID,
  private_key_id: process.env.EXPRESS_APP_PRIVATE_KEY_ID,
  private_key: process.env.EXPRESS_APP_PRIVATE_KEY,
  client_email: process.env.EXPRESS_APP_CLIENT_EMAIL,
  client_id: process.env.EXPRESS_APP_CLIENT_ID,
  auth_uri: process.env.EXPRESS_APP_AUTH_URI,
  token_uri: process.env.EXPRESS_APP_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.EXPRESS_APP_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.EXPRESS_APP_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/public", express.static(__dirname + "/public"));
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// app.use(
//   session({
//     name: "Mycookie",
//     secret: "given cookies",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

const configRoutes = require("./routes");
configRoutes(app);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
