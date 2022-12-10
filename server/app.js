const express = require("express");

const configRoutes = require("./routes");
const cors = require("cors");

const compression = require("compression");

const app = express();
app.use(cors());

const PORT = 3008;

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const configRoutes = require("./routes");
configRoutes(app);

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


configRoutes(app);

app.listen(3008, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3008");
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

