require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const TimeTracker = require("../modals/timetrackerModel");

// get all data

router.get("/data", getUserFromToken, async (req, res) => {
  try {
    const userId = req.userId;
    const allData = await TimeTracker.findOne({ userId: userId });
    res.send(allData.allData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// post new entry

router.post("/data", getUserFromToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { date, title, showDate, project, tags, startTime, endTime } =
      req.body;
    const newObject = {
      date: date,
      title: title,
      showDate: showDate,
      project: project,
      tags: tags,
      startTime: startTime,
      endTime: endTime,
    };
    const result = await TimeTracker.updateOne(
      { userId: userId },
      { $push: { "allData.data": newObject } }
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// post in progress entry to db

router.post("/data/progress", getUserFromToken, async (req, res) => {
  const userId = req.userId;
  const { title, project, tags, startTime } = req.body;
  const newinProgress = {
    title: title,
    project: project,
    tags: tags,
    startTime: startTime,
  };
  const result = await TimeTracker.updateOne(
    { userId: userId },
    { $set: { "allData.inProgress": newinProgress } }
  );
  const ans = await TimeTracker.findOne({ userId: userId });

  res.send(ans);
  // res.sendStatus(200);
});

//del inprogress from db

router.post("/data/clear/progress", getUserFromToken, async (req, res) => {
  const userId = req.userId;
  const result = await TimeTracker.updateOne(
    { userId: userId },
    { $set: { "allData.inProgress": null } }
  );

  res.sendStatus(200);
});

router.post("/data", getUserFromToken, async (req, res) => {
  const userId = req.userId;
});

// middleware to authenticate tokens

function getUserFromToken(req, res, next) {
  try {
    const authHeaders = req.headers["authentication"];
    const token = authHeaders.split(" ")[1];

    if (!token) {
      return res.status(400).send({ message: "no token found" });
    }
    jwt.verify(token, process.env.access_secret_key, (err, user) => {
      if (err) {
        return res.status(400).send({ message: "invalid token" });
      }
      req.userId = user.id;
      next();
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

module.exports = router;
