const express = require("express");

const router = express.Router();

const multer = require("multer");
const {
  allItems,
  createItem,
  updateItem,
  getItem,
  deleteItem,
  uploadCoverImage,
} = require("../controllers/item");

require("../services/cloudinary.config");

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid image file", false);
  }
};
const uploads = multer({ storage, fileFilter });

// Item Routes

// get all items
router.get("/items/all", allItems);

// get single item
router.get("/items/:id", getItem);

// create item
router.post("/item/create", createItem);

// upload cover image
router.post("/item/upload", uploads.single("avatar"), uploadCoverImage);

// update item
router.patch("/items/update/:id", updateItem);

// delete item
router.delete("/item/delete/:id", deleteItem);

module.exports = router;
