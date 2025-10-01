const express = require("express");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authController.protect, userController.me);
router.patch(
  "/update-balance",
  authController.protect,
  userController.changeBalance
);
router.patch(
  "/update-error",
  authController.protect,
  userController.changeError
);

module.exports = router;
