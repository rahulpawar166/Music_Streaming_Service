const express = require("express");
const app = express();
const compression = require("compression");
const PORT = 4000;

app.use(compression());

const configRoutes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
