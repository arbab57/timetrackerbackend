require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const calanderModel = require("../modals/calanderModel");
const CalenderControl = require("../controllers/calenderControl")

router.get("/data", getUserThroughToken, CalenderControl.getData);
router.post("/data/add-entry", getUserThroughToken, CalenderControl.addEntry);
router.delete("/data/del-entry/:entryId", getUserThroughToken, CalenderControl.delEntry);




function getUserThroughToken(req, res, next) {
  const authHeader = req.headers["authentication"];
  const access_token = authHeader && authHeader.split(" ")[1];
  if (access_token === null) {
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
