const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/cors");
const cookieParser = require("cookie-parser");
const credentials = require("./middlewares/credentials");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

//middleware
app.use(credentials);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

//app
app.use("/", require("./routes/Auth"));

app.get("/", (req, res) => {
  res.send("Welcome to Backend Server");
});

app.listen(PORT, () => {
  console.log(`Your backend is running on PORT no : ${PORT}`);
});
