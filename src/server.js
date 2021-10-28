const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

app.use(cors());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to blockchain project application." });
});

require("./routes/pabrik.routes")(app);


// set port, listen for requests
app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});
