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
  res.json({ success: true, user });
};

// get user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
      res.status(200);
      res.send(user);
    } else {
      res.status(404);
      res.send({ success: false, message: "user not found" });
    }
  } catch (error) {
    res.status(404);
    res.send({ success: false, message: "user doesn't exist!" });
    console.log("Error fetching user: ", error.message);
  }
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

  let oldTokens = user.tokens || [];
  if (oldTokens.length) {
    oldTokens = oldTokens.filter((token) => {
      const timeDiff = (Date.now() - parseInt(token.signedAt)) / 1000;
      if (timeDiff < 86400) {
        return token;
      }
    });
  }
  await User.findByIdAndUpdate(user._id, {
    tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
  });
  const userInfo = {
    id: user._id,
    surname: user.surname,
    givenName: user.givenName,
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

// Sign Out
exports.signOut = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization failure",
      });
    }
    const tokens = req.user.tokens;

    const newTokens = tokens.filter((t) => t.token !== token);

    try {
      await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
      res
        .status(201)
        .json({ success: true, message: "Signed Out Succesfully" });
    } catch (error) {
      console.log("Error while signing out: ", error.message);
    }
  }
};
