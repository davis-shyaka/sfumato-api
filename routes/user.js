const express = require("express");

const router = express.Router();

const { check } = require("express-validator");

const {
  createUser,
  userSignIn,
  uploadProfile,
  signOut,
  getUser,
} = require("../controllers/user");

// const { createItem } = require("../controllers/item");

const { isAuth } = require("../middleware/auth");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middleware/validation/user");

const multer = require("multer");
const User = require("../models/user");
const {
  validateItemCreation,
  itemValidation,
} = require("../middleware/validation/item");
const { createItem } = require("../controllers/item");

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid image file", false);
  }
};
const uploads = multer({ storage, fileFilter });

// User Routes
router.post("/createUser", validateUserSignUp, userValidation, createUser);
router.get("/users/:id", getUser);
router.post("/signIn", validateUserSignIn, userValidation, userSignIn);
router.post("/signOut", isAuth, signOut);
router.post("/uploadProfile", isAuth, uploads.single("profile"), uploadProfile);

// Item Routes
router.post(
  "/createItem",
  isAuth,
  validateItemCreation,
  itemValidation,
  createItem
);
module.exports = router;
