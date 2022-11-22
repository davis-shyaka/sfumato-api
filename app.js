const express = require("express");
const User = require("./models/user");

require("dotenv").config();

require("./models/db");

const userRouter = require("./routes/user");

// const User = require("./models/user");

const app = express();

// Middleware function

// Long way
// app.use((req, res, next) => {
//   req.on("data", (chunk) => {
//     const data = JSON.parse(chunk);
//     req.body = data;
//     next();
//   });
// });

// Less syntax
app.use(express.json());

app.use(userRouter);

// const test = async (email, password) => {
//   const user = await User.findOne({ email });
//   // if (!user) {
//   //   throw new Error("User not found!");
//   // }
//   const result = await user.comparePassword(password);
//   console.log(result);
// };

// test("edgar3@gmail.com", "edgar12");

app.get("/test", (req, res) => {
  res.send("I'm here");
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend Zone" });
});

app.listen(8000, () => {
  console.log("Port is listening");
});
