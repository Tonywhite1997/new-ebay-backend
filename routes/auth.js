const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/check", authController.check);
router.patch(
  "/change-password",
  authController.protect,
  authController.changePassword
);

module.exports = router;
