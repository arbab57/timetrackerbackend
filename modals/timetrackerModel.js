const mongoose = require("mongoose");

const timeEntrySchema = new mongoose.Schema({
  email: { type: String },
  userId: { type: String, required: true },
  data: [
    {
      date: { type: Number },
      title: { type: String },
      showDate: { type: String },
      project: { type: String },
      tags: [{ type: String }],
      startTime: { type: Number },
      endTime: { type: Number },
    },
  ],
});

module.exports = mongoose.model("TimeTrackerData", timeEntrySchema);
