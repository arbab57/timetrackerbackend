require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

mongoose.connect(process.env.dbURL);
const db = mongoose.connection;
db.on("error", () => console.log(error));
db.once("open", () => console.log("Connected to db"));

app.use(express.json());
app.use(cors());

const calanderRouter = require("./routes/calanderRoutes");
const userRouter = require("./routes/usersRoutes");

app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/calander", calanderRouter);
app.use("/users", userRouter);

app.listen(process.env, () => {
  console.log(`Server running on ${process.env.port}`);
});
