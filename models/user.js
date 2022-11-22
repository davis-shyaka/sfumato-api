const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // One Way to validate email duplicity
    // validate: {
    //   validator: async function (email) {
    //     const user = await this.constructor.findOne({ email });
    //     if (user) {
    //       if (this.id === user.id) {
    //         return true;
    //       }
    //       return false;
    //     }
    //     return true;
    //   },
    //   message: (props) => "The specified email address is already in use.",
    // },
  },
  password: {
    type: String,
    required: true,
  },
  avatar: String,
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing; nothing to compare");
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Error while comparing the password: ", error.message);
  }
};

userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("Invalid Email");
  try {
    const user = await this.findOne({ email });
    if (user) return false;
    return true;
  } catch (error) {
    console.log("error inside isThisEmailInUse method: ", error.message);
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);
