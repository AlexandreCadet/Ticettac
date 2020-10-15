var express = require('express');
var router = express.Router();
var connection = require("../models/connection");


var userModel = require('../models/user');
var journeyModel = require('../models/journey');

const mongoose = require('mongoose');





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });


});

module.exports = router;

router.post('/sign-up', async function (req, res, next){

  var newUser = new userModel({

    name: req.body.name,
    firstName : req.body.firstName,
    email : req.body.email,
    password : req.body.password,
    journey : []
  });

  var newUser = await newUser.save();
 
  res.redirect('/');
});


router.post('/sign-in', async function (req, res, next){

 var user = await userModel.find(); // met tous les users dans la variable user

 for(i=0;i<user.length;i++){
  var userEmail = user[i].email;
  var userPassword = user[i].password;
  
 }

 if(req.body.email == userEmail && req.body.password == userPassword ){


  res.render("ticket", {user})
 } else {

  res.redirect('/')
 }

});

router.get('/mylasttrips', async function(req, res, next) {

  var userId = await userModel.findById();


  res.render('mylasttrips', userId);

});

router.post('/search', async function(req, res, next) {

var journey = await journeyModel.find();


if(journey.departure == req.body.departure && journey.arrival == req.body.arrival && journey.date == req.body.arrival){
  var myDeparture = req.body.departure
  var myArrival = req.body.arrival
  var myDate = req.body.date

  console.log("matched !");
  res.render("tickets",{ myDeparture, myArrival, myDate} )

} else {
  res.redirect("/error")
  console.log("not matched");
}

console.log(myJourney);

});





