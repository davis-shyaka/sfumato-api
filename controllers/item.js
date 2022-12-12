const Item = require("../models/item");
const sharp = require("sharp");
const cloudinary = require("../helper/imageUpload");

// Get all items
exports.allItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json({ success: true, message: "All Items", items });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Create item
exports.createItem = async (req, res) => {
  try {
    const { avatar, artist, email, title, category, isFree, price, size } =
      req.body;
    // console.log(req.body);
    const item = await Item({
      avatar,
      artist,
      email,
      title,
      category,
      isFree,
      price,
      size,
    });
    await item.save();
    res.json({ success: true, message: "Created item successfully", item });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error creating item: ", error.message);
  }
};

// Upload cover image
exports.uploadCoverImage = async (req, res) => {
  const { item } = req;
  if (!item) {
    return res
      .status(401)
      .json({ success: false, message: "Error: No item found" });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "sfumato/itemImages",
      public_id: `${item._id}_cover`,
    });
    await item.findByIdAndUpdate(item._id, { avatar: result.url });
    res.status(201).json({ success: true, message: "Cover Set Succesfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Try again after some time",
    });
    console.log("Error while uploading cover image: ", error.message);
  }
};

// Get individual item
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    if (item) {
      res.status(200);
      res.send(item);
    } else {
      res.status(404);
      res.send({ success: false, message: "Item not found" });
    }
  } catch (error) {
    res.status(404);
    res.send({ success: false, message: "Item doesn't exist!" });
    console.log("Error fetching item: ", error.message);
  }
};

// Update items
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    const { artist, email, title, category, isFree, price, size } = req.body;
    if (artist) {
      item.artist = artist;
    }

    if (email) {
      item.email = email;
    }

    if (title) {
      item.title = title;
    }

    if (category) {
      item.category = category;
    }

    if (isFree) {
      item.isFree = isFree;
    }

    if (price) {
      item.price = price;
    }

    if (size) {
      item.size = size;
    }

    await item.save();
    res.status(201);
    res.json({ success: true, message: "Item updated succesfully", item });
  } catch (error) {
    res.status(404);
    res.json({ success: false, message: "Item doesn't exist!" });
    console.log("Error updating item: ", error.message);
  }
};

// Delete items
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    await item.remove();
    res.status(200);
    res.json({ success: true, message: "Item deleted succesfully", item });
  } catch (error) {
    res.status(404);
    res.json({
      success: false,
      message: "Item doesn't exist.",
    });
    console.log("Error deleting item: ", error.message);
  }
};
