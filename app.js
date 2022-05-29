// Import module
let express = require("express");
let morgan = require("morgan");

// Main
let router = express.Router();
let app = express();
app.use(morgan("dev"));
app.use(express.static("public"));
app.set("port", process.env.PORT || 3131);
app.listen(app.get("port"));

console.log(`Running at port ${app.get("port")}`);
