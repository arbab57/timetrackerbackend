require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const calanderModel = require("../modals/calanderModel");

router.get("/data", getUserThroughToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await calanderModel.findOne({ userId: userId });
    res.json(data.data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

function getUserThroughToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const access_token = authHeader && authHeader.split(" ")[1];

  if (access_token == null) {
    res.status(401).send({ message: "no token provided" });
    return;
  }

  jwt.verify(access_token, process.env.access_secret_key, (err, user) => {
    if (err) return res.status(403).send({ message: "invalid token" });
    req.user = user;
    next();
  });
}

module.exports = router;
