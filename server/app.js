require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3008;
const path = require("path");

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const configRoutes = require("./routes");
configRoutes(app);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

