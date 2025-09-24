const express = require("express");
const router = express.Router();
const Auth = require("../controllers/Auth");
router.route("/signup").post(Auth.signUp); //post because I will send data to store in DB
router.route("/signin").post(Auth.signIn); // post because I will send data to check user credentials
router.route("/signout").get(Auth.signOut); // no data will send from frontend, it will take jwt cookie and signout the user
module.exports = router;
