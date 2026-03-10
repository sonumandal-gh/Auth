const express = require("express");
const session = require("express-session");
const mongoConnect = require("./database/database");
const path = require("path");

const AuthRouter = require("./routes/authRouter");

const app = express();

//  Template engine setup
app.set("view engine", "ejs");    // use EJS
app.set("views", "views");        // views folder ka path

// Session
app.use(session({ 
  secret: "my secret",
  resave: false,
  saveUninitialized: true
}));

// Body parser
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));  

// Routes
app.use(AuthRouter);

// Connect MongoDB
mongoConnect()
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(3100, () => console.log("Server running on port 3100"));
  })
  .catch(err => console.log(err));