const mongoose = require("mongoose");

const MONGO_URL = "mongodb+srv://SonuMandal:Sonu%238252@project.wjhnvbo.mongodb.net/?appName=Project";

const mongoConnect = () => {
  return mongoose.connect(MONGO_URL).then(() =>{
    console.log("MongoDB Connected Successfully");
  } )
  .catch(err =>{
    console.log("MongoDB Error:", err);
  });
}

module.exports = mongoConnect;