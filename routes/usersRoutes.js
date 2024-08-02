const express = require("express");
const router = express.Router();
const UserData = require("../modals/usersModel");
const CalanderData = require("../modals/calanderModel");
const bcrypt = require("bcrypt");

// signup

router.post("/signup", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const hashedPassowrd = await bcrypt.hash(password, 10);
    const newUser = new UserData({
      userName: userName,
      password: hashedPassowrd,
    });

    const userToSend = await newUser.save();
    const calanderData = new CalanderData({
      userName: userToSend.userName,
      userId: userToSend.id,
      data: [],
    });
    const x = await calanderData.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const user = await UserData.findOne({ userName: req.body.userName });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).send({ message: "Incorrect passwrd" });
    }
    res.status(200).send({ message: "logged in" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
