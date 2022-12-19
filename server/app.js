require("dotenv").config();
const express = require("express");
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

const configRoutes = require("./routes");
configRoutes(app);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
