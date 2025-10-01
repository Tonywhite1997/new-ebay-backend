const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { config } = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const cardRoutes = require("./routes/card");

config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ebay-checker.com",
  "https://steam-checker.com",
  "https://apple-client-ecru.vercel.app",
  "https://steam-checker.netlify.app",
];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/card", cardRoutes);

const DB = process.env.DB.replace("<db_password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection to database was established");
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.set("strictQuery", false);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
