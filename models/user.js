var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    firstName : String,
    email : String,
    password : String,
    journey : [{type: mongoose.Schema.Types.ObjectId, ref:"journeys"}]
    
  });
  
  var userModel = mongoose.model('journey', userSchema);

  module.exports = userModel