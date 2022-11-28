const express = require("express");

const router = express.Router();

const { check } = require("express-validator");

const {
  createUser,
  userSignIn,
  uploadProfile,
  signOut,
} = require("../controllers/user");
const { isAuth } = require("../middleware/auth");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/user");

const multer = require("multer");
const User = require("../models/user");

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid image file", false);
  }
};
const uploads = multer({ storage, fileFilter });

router.post("/createUser", validateUserSignUp, userValidation, createUser);
router.post("/signIn", validateUserSignIn, userValidation, userSignIn);
router.post("/signOut", isAuth, signOut);
router.post("/uploadProfile", isAuth, uploads.single("profile"), uploadProfile);

// router.post("/createItem", isAuth, (req, res) => {
//   // create an item
//   res.send("Item added succesfully");
// });

module.exports = router;
