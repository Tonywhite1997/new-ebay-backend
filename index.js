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
  "https://secure8-giftcard.vercel.app",
  "https://ebay-client.vercel.app",
  "https://gold-razer-client.vercel.app",
  "https://steam-check-client.vercel.app",
  "https://xxboxx.vercel.app",
  "https://gold-razor.com",
  "https://ebay-balance.com",
  "https://box-balance.com",
  "https://razer-balance.com",
];

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, origin || true);
    }

    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
