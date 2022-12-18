require("dotenv").config();
const express = require("express");
const process = require("process");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3008;

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
