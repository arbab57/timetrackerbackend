require("dotenv").config();
const express = require("express");
const router = express.Router();
const UserData = require("../modals/usersModel");
const CalanderData = require("../modals/calanderModel");
const TimeTrackerData = require("../modals/timetrackerModel");
const Tokens = require("../modals/tokens");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/check", getUserFromToken, (req, res) => {
  res.status(200);
});

//get userData
router.get("/data", getUserFromToken, async (req, res) => {
  const userId = req.userId;
  const data = await UserData.findOne({ _id: userId });
  res.json(data.email);
});

// signup

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isInUse = await UserData.findOne({ email: email });
    if (!email || !password) {
      return res.status(401).send({ message: "no password or email" });
    }

    if (isInUse !== null) {
      return res
        .status(401)
        .send({ message: "email aleady has an acount, login instead" });
    }

    const hashedPassowrd = await bcrypt.hash(password, 10);
    const newUser = new UserData({
      email: email,
      password: hashedPassowrd,
    });

    const userToSend = await newUser.save();
    createDB(userToSend);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const user = await UserData.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Incorrect passwrd" });
    }

    const payLoad = { email: user.email, id: user._id };
    const accessToken = generateAccessToken(payLoad);
    const refreshToken = await new Tokens({
      refreshToken: generateRefreshToken(payLoad),
    }).save();

    res.json({
      accessToken: accessToken,
      refreshToken: refreshToken.refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//refresh token

router.post("/refreshToken", async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).send({ message: "No refresh token provided" });
    }
    const toCheck = await Tokens.findOne({ refreshToken: refreshToken });
    if (!toCheck) {
      return res.status(403).send({ message: "invalid token" });
    }

    jwt.verify(refreshToken, process.env.refresh_secret_key, (err, user) => {
      if (err) {
        return res.status(403).send({ message: "Invalid refresh token" });
      }

      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
      });
      res.json({ accessToken: accessToken });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//logout

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.send("Logged out");
});

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.access_secret_key, {
    expiresIn: "100m",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.refresh_secret_key, {
    expiresIn: "7d",
  });
};

async function createDB(userToSend) {
  const calanderData = new CalanderData({
    email: userToSend.email,
    userId: userToSend.id,
    data: [],
  });
  const timeTrackerData = new TimeTrackerData({
    email: userToSend.email,
    userId: userToSend.id,
    data: [],
  });
  const x = await calanderData.save();
  const y = await timeTrackerData.save();
}

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
