const jwt = require("jsonwebtoken");
const Item = require("../models/item");
const User = require("../models/user");

exports.itemMiddleware = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded object: ", decode);
      const user = await User.findById(decode.userId);
      console.log(user);
      if (!user) {
        return res.json({
          success: false,
          message: "Forbidden: Unauthorized access!",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      res.json({ success: false, message: `Forbidden: ${error.message}` });
    }
  } else {
    res.json({ success: false, message: "Forbidden: Unauthorized access!" });
  }
  console.log(req.headers.authorization);
};
