const mongoose = require("mongoose");
const user = require("./User");

const cardSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
  },
  secreteCode: {
    type: String,
    require: true,
  },
  website: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
