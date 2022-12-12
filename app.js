const express = require("express");
const User = require("./models/user");

require("dotenv").config();

require("./models/db");

const userRouter = require("./routes/user");
const itemRouter = require("./routes/item");

const app = express();

// Middleware function

// Less syntax
app.use(express.json());

app.use(userRouter);
app.use(itemRouter);

app.get("/some-route", (req, res) => {
  res.send("I'm here");
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend Zone" });
});

app.listen(8000, () => {
  console.log("Port is listening on 8000...");
});
