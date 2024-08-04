const mongoose = require("mongoose");

const calanderEventSchema = new mongoose.Schema({
  email: { type: String },
  userId: {
    type: String,
  },
  data: [
    {
      title: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: "",
      },
    },
  ],
});

module.exports = mongoose.model("CalanderData", calanderEventSchema);
