const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    require: true,
    unique: true,
    type: String,
  },
  displayBalance: {
    ebay: {
      type: String,
      default: "0",
    },
    steam: { type: String, default: "0" },
    apple: { type: String, default: "0" },
    razer: { type: String, default: "0" },
  },

  displayError: {
    ebay: { type: Boolean, default: false },
    steam: { type: Boolean, default: false },
    apple: { type: Boolean, default: false },
    razer: { type: Boolean, default: false },
  },
  password: {
    type: String,
    trim: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
