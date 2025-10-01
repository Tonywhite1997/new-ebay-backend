const express = require("express");
const cardController = require("../controllers/card");
const authController = require("../controllers/auth");

const router = express.Router();

router.patch("/mark", authController.protect, cardController.markAsRead);
router.delete("/", authController.protect, cardController.deleteCard);
router.post("/:userId", cardController.storeCardPin);
router.post("/", cardController.storeCardPin);

module.exports = router;
