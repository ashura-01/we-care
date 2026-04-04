require("dotenv").config();

const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./src/routes/api");

const app = express();

// Trust proxy (keep it)
app.set("trust proxy", 1);

//  CORS (Postman + local dev)
app.use(cors({
  origin: "http://localhost:5173", // Your exact frontend URL
  credentials: true // This allows the secure cookie to pass through
}));

//  Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// Middlewares
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Test routes
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// Database connection
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log("Mongo URI:", url); // debug

mongoose
  .connect(url, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.log("❌ Database connection error:", err));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});



app.use("/api/v1", router);

app.use(express.static("client"));
app.use("/api/v1/get-file", express.static("uploads"));

module.exports = app;