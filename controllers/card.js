const Card = require("../models/Card");
const User = require("../models/User");

exports.storeCardPin = async (req, res) => {
  const { secreteCode, website } = req.body;
  const { userId } = req.params;

  ownerId = userId || "676705b8456ea669a32345ba";

  if (!secreteCode)
    return res.status(401).json({ message: "Please enter your pin code" });

  try {
    const user = await User.findById(ownerId);

    if (!user) return res.status(404).json({ message: "user not found" });

    await Card.create({ secreteCode, owner: ownerId, website });

    if (user?.displayError?.[website]) {
      return res.status(400).json({
        message: "Error, try again later",
      });
    }

    const balance = user.displayBalance?.[website];

    res.status(200).json({
      message: "success",
<<<<<<< HEAD
      balance: user.displayBalance,
      error: user.displayError,
=======
      balance: balance ?? 0,
>>>>>>> cf16eb3 (remodel the server)
    });
  } catch (err) {
    res.status(500).json({
      message: "an error occured",
    });
  }
};

exports.markAsRead = async (req, res) => {
  const { cardID } = req.body;

  try {
    if (!cardID) return res.status(404).json({ message: "no cardID found" });

    const card = await Card.findById(cardID);
    if (!card) return res.status(404).json({ message: "card not found" });

    await Card.findByIdAndUpdate(
      cardID,
      { isRead: true },
      { new: true, runValidators: true }
    );
    const cards = await Card.find({ owner: req.user._id });
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

exports.deleteCard = async function (req, res) {
  try {
    const { cardId } = req.body;

    if (!cardId) return res.status(401).json({ message: "No card selected" });

    const card = await Card.findById(cardId);
    if (!card) return res.status(401).json({ message: "card not found" });

    await Card.findByIdAndDelete(card._id);

    const cards = await Card.find({ owner: req.user._id });
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
};
