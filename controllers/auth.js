const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Card = require("../models/Card");

const getJWTToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

const isDev = process.env.NODE_ENV === "development";

const cookieOptions = {
  maxAge: 90 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: !isDev, 
  sameSite: isDev ? "lax" : "none", 
};

const createSendToken = (user, res, statusCode) => {
  try {
    const token = getJWTToken(user._id);

    res.cookie("jwt", token, cookieOptions);

    res.status(statusCode).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

exports.signup = async (req, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });
  user.password = undefined;

  createSendToken(user, res, 201);
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select({
      password: true,
      name: true,
      email: true,
    });
    if (!user) return res.status(404).json({ message: "invalid credentials" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    createSendToken(user, res, 201);
  } catch (err) {
    res.status(500).json({ message: "Err" });
  }
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token)
      return res.status(401).json({ message: "Please login to continue" });

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    if (!decoded)
      return res.status(200).json({
        message: "Unauthorized",
      });

    const freshUser = await User.findById(decoded.userId);
    if (!freshUser)
      return res
        .status(401)
        .json({ message: "The user belonging to this token does not exist" });

    req.user = freshUser;
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Error",
      error: err,
    });
  }
};

exports.check = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(400).json({ message: "token required" });
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(400).json({ message: "no user found" });
  }

  const user = await User.findById(decoded.userId);
  if (!user) return res.status(400).json({ message: "user does not exist" });

  const cards = await Card.find({ owner: user._id });

  res.status(200).json({
    user,
    cards,
  });
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!newPassword || !oldPassword)
      return res
        .status(400)
        .json({ message: "old password and new password required" });

    const user = await User.findById(req.user._id).select({ password: true });

    console.log({ userPass: user.password, oldPassword });

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch)
      return res.status(400).json({ message: "incorrect old password" });

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "password changed!" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
