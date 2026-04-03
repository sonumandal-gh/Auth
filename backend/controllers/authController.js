const { validationResult } = require("express-validator");
const User = require("../models/user"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude passwords
    res.status(200).json({ message: "Users fetched.", users: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Fetching users failed." });
  }
};

exports.postSignUp = async (req ,res) => {
  const {firstName , lastName, email, password, role} = req.body;

  const error = validationResult(req);

  if(!error.isEmpty()){
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: error.array()
    });
  }

  try {
    const existinguser = await User.findOne({email});

    if (existinguser) {
      return res.status(422).json({ message: "User exists already, please pick a different email." });
    }

    const hashedPassword = await bcrypt.hash(password,12);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    res.status(201).json({ message: "User created successfully!", userId: user._id });
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "User creation failed." });
  }
};

exports.postLogin = async (req, res) => {
  const { email , password } = req.body;

  try {
    const user = await User.findOne({ email });

    if(!user){
      return res.status(401).json({ message: "A user with this email could not be found." });
    }

    const isMatch = await bcrypt.compare(password , user.password);

    if(!isMatch){
      return res.status(401).json({ message: "Wrong password!" });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: token, userId: user._id.toString(), firstName: user.firstName });
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "Login failed." });
  }
};

exports.postLogout = (req, res) => {
  // Since we are using JWT, the frontend just needs to delete the token.
  res.status(200).json({ message: "Logged out successfully." });
};