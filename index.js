const express = require("express");
const app = express();
const router = require("./routes/route");
const bodyParser = require("body-parser");

app.listen(3000, () => console.log("listening on port 3000"));


app.use(bodyParser.json())
app.use("/", router);
