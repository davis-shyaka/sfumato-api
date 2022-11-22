const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sharp = require("sharp");
const cloudinary = require("../helper/imageUpload");

exports.createUser = async (req, res) => {
  const { surname, givenName, email, password } = req.body;
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser)
    return res.json({
      success: false,
      message: "This email is already in use",
    });
  const user = await User({
    surname,
    givenName,
    email,
    password,
  });
  await user.save();
  res.json(user);
};

// Sign In
exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "User not found that matches this email",
    });

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return res.json({
      success: false,
      message: "Password does not match given email",
    });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const userInfo = {
    surname: user.surname,
    email: user.email,
    avatar: user.avatar ? user.avatar : "",
  };
  res.json({ success: true, user: userInfo, token });
};

// Upload Profile Picture / Avatar
exports.uploadProfile = async (req, res) => {
  const { user } = req;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Forbidden: Unauthorized access" });
  }

  try {
    // const profileBuffer = req.file.buffer;
    // const { width, height } = await sharp(profileBuffer).metadata();
    // const avatar = await sharp(profileBuffer)
    //   .resize(Math.round(width * 0.5), Math.round(height * 0.5))
    //   .toBuffer();

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "sfumato/userAvatars",
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });
    await User.findByIdAndUpdate(user._id, { avatar: result.url });
    res.status(201).json({ success: true, message: "Avatar Set Succesfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Try again after some time",
    });
    console.log("Error while uploading avatar: ", error.message);
  }
};
