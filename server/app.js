const express = require("express");
const compression = require("compression");
const app = express();

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

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});