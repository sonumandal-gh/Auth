require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoConnect = require("./database/database");

const AuthRouter = require("./routes/authRouter");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check & Root endpoint (for Render / uptime monitors)
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Auth Backend API is running." });
});

// Routes
app.use("/api/auth", AuthRouter);

const PORT = process.env.PORT || 3100;

mongoConnect().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}).catch(err => {
  console.error("Database connection failed", err);
});