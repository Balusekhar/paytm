const express = require("express");
const router = express.Router();

router.get("signup", (req, res) => {
  res.send("Signup route");
});

router.get("signin", (req, res) => {
  res.send("Signin route");
});

app.get("update", (req, res) => {
  res.send("Update user info route");
});

module.exports = router;
