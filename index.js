require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/index");

const app = express();

mongoose.connect(process.env.dbURL);
const db = mongoose.connection;
db.on("error", () => console.log(error));
db.once("open", () => console.log("Connected to db"));

app.use(express.json());
app.use(cors());

app.use("/calander", routes.calanderRouter);
app.use("/users", routes.userRouter);

app.listen(process.env, () => {
  console.log(`Server running on ${process.env.port}`);
});
