const {validationResult} = require("express-validator");
const User = require("../models/user"); 
const bcrypt = require("bcryptjs");

exports.getHome = (req, res, next) => {
  console.log("Session Value:", req.session);

  User.find({})  
    .then(users => {
      res.render("home", {
        allUsers: users,
        pageTitle: "Home Page",
        cssFile: "home",
        isLoggedIn: req.session?.isLoggedIn || false,
        user: req.session?.user || null
      });
    })
    .catch(err => console.log(err));
};

exports.getLogin = (req, res ,next) =>{
  res.render("Auth/login", {
    pageTitle: "Login Page",
    cssFile: "login",
    isLoggedIn: req.session.isLoggedIn || false,
    errorMessage: null,
    oldInput: {
      email: ""
    }
  });
};

exports.getSignup = (req, res , next) =>{
  res.render("Auth/signup", {
    pageTitle : "SignUp Page",
    cssFile: "signup",
    isLoggedIn: false,
    errorMessages: null,
    oldInput: {},
    user: {}
  });
}

exports.postSignUp = async (req ,res) => {
  const {firstName , lastName, email, password, role} = req.body;

  const error = validationResult(req);

  if(!error.isEmpty()){
    return res.status(422).render("Auth/signup" ,{
      pageTitle: "SignUp page",
      cssFile: "signup",
      isLoggedIn: false,
      errorMessages: error.array(),
      oldInput: {
        firstName,
        lastName,
        email,
        password,
        role
      }
    });
  }

  try {
    const existinguser = await User.findOne({email});

    if (existinguser) {
      return res.status(422).render("Auth/signup",{
        PageTitle:"Sign Up",
        cssFile:"signUp",
        isLoggedIn:false,
        errorMessages:[{msg:"Email already exists"}],
        oldInput:{fullName,email,password,role},
        user: {}
      });
    }

    const hashedPassword = await bcrypt.hash(password,12);

    const user = new User({
      firstName,
      lastName,
      email,
      password:hashedPassword,
      role
    });

    await user.save();

    console.log("User Created Successfully");

    res.redirect("/login");
  }catch(err){
    console.log(err);
    res.redirect("/signup");
  }

};

exports.postLogin = async (req, res) => {

  const { email , password } = req.body;

  const user = await User.findOne({ email });

  if(!user){
    return res.render("Auth/login",{
      pageTitle:"Login Page",
      cssFile:"login",
      isLoggedIn:false,
      errorMessage:"User does not exist"
    });
  }


  const isMatch = await bcrypt.compare(password , user.password);

  if(!isMatch){
    return res.render("Auth/login", {
      pageTitle: "Login Page",
      cssFile: "login",
      isLoggedIn: false,
      errorMessage: "Incorrect password",
      oldInput: { email }
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = user;

  res.redirect('/');

};

exports.postLogout = (req, res) => {

  req.session.destroy(() => {
    res.redirect('/login');
  });

};