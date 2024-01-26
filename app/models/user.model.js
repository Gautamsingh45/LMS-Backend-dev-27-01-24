const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token1: String,
    confirmationCode: String,
    role: String, // Store user role as a string
    isConfirmed: Boolean,
    date: Date,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      },
     
    ],
    
   
  })
);

module.exports = User;
