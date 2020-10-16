var express = require('express');
var router = express.Router();
var connection = require("../models/connection");


var userModel = require('../models/user');
var journeyModel = require('../models/journey');

const mongoose = require('mongoose');





/* GET home page. */
router.get('/', function(req, res, next) {
  //if (req.session.user===undefined){
   // req.session.user= [];
  //}
  res.render('login', { title: 'Express' });
});

module.exports = router;

/* GET SIGN-UP */



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


  req.session.user= await userModel.findOne({
    email: req.body.email,
    password: req.body.password,
  });


  if (req.session.user != null) { // si user existe bien, execute le code si dessous
    req.session.user = { name: req.session.user.name, id: req.session.user._id }; // stocke le nom et l'id du user dans la session
    console.log("match");
    res.render("ticket",{user:req.session.user})
  } else { // si user n'existe pas, execute le code si dessous
    console.log("not matched");
    res.redirect('/')
  }

});

router.get('/mylasttrips', async function(req, res, next) {

  var userId = await userModel.findById();


  res.render('mylasttrips', userId);

});

 router.post('/search', async function(req, res, next) {

 req.session.user = await journeyModel.find({departure : req.body.departure, arrival : req.body.arrival, date : req.body.date});


 if(req.session.user !==null){

  console.log("matched !");   

   res.render("ticketcard",{ user : req.session.user});


 } else {
   res.render("error")
   console.log("not matched");
 }

 });

 router.get("/add-journey", function (req, res, next){ 

userModel.findOne(req.session.user._id)
        .populate("journeys")
        .exec

// trouve le user par son id


  res.render ("mytickets",{user : req.session.user})
 });



 //--------------ERROR-------------//

router.get("/error", function (req, res, next){
  res.render ("error")
})




