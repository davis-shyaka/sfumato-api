const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  artist: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isFree: {
    type: Boolean,
  },
  price: {
    type: Number,
  },
  size: {
    type: String,
    required: true,
  },
  avatar: String,
});

module.exports = mongoose.model("Item", itemSchema);
