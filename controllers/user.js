const User = require("../models/User");
const Card = require("../models/Card");

exports.me = async (req, res) => {
  const me = await User.findById(req.user._id);

  if (!me) return res.status(401).json({ message: "user not found" });

  const cards = await Card.find({ owner: me._id }).sort({ createdAt: -1 });

  res.status(200).json({ me, cards });
};

exports.changeBalance = async (req, res) => {
  try {
    const { newAmount, website } = req.body;

    if (!newAmount) {
      return res
        .status(400)
        .json({ message: "new amount should not be empty" });
    }

    if (!website) {
      return res.status(400).json({ message: "website field is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { [`displayBalance.${website}`]: newAmount } }, // ✅ dynamic path
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.changeError = async (req, res) => {
  try {
    const { website } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentValue = user.displayError?.[website];
    const newValue = !currentValue;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { [`displayError.${website}`]: newValue } },
      { new: true, runValidators: true }
    );
    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
exports.changeError = async (req, res) => {
  try {
    const { currentError } = req.body;

    const formattedError = currentError.toString();

    if (!formattedError)
      return res.status(401).json({ message: "new error should not be empty" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { displayError: currentError },
      { new: true, runValidators: true }
    );

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
