require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoConnect = require("./database/database");
const path = require("path");

const AuthRouter = require("./routes/authRouter");

const app = express();

// Template engine
app.set("view engine", "ejs");
app.set("views", "views");

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  })
}));

// Body parser
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(AuthRouter);

const PORT = process.env.PORT || 3100;

mongoConnect().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
});