const express = require("express");
const router = express.Router();
const CalanderData = require("../modals/calanderModel");

router.get("/data/:id", async (req, res) => {
  try {
    const data = await CalanderData.findOne({ userId: req.params.id }, "data");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
