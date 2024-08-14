const CalanderModel = require("../modals/calanderModel")

exports.getData = async (req, res) => {
    try {
      const userId = req.user.id;
      const data = await CalanderModel.findOne({ userId: userId });
      res.status(200).json(data.data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  exports.addEntry = async (req, res) => {
    try {
      const userId = req.user.id;
      const {title, date, color} = req.body
      const data = await CalanderModel.findOne({ userId: userId });
      const newEntry = {
        title: title,
        date: date,
        color: color
      }
      data.data.push(newEntry)
      await data.save()
      res.status(201).json({msg: "entry added"})
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  exports.delEntry = async (req, res) => {
    try {
      const userId = req.user.id;
      const {entryId} = req.params
      const data = await CalanderModel.findOne({ userId: userId });
      data.data.pull(entryId)
      await data.save()
      res.status(200).json({msg: "entry deleted"})
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }