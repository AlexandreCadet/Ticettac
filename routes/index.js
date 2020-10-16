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

 var journey = await journeyModel.find({departure : req.body.departure, arrival : req.body.arrival, date : req.body.date});


 if(journey !== null){

  console.log("matched !");   

   res.render("ticketcard",{ journey});


 } else {
   res.render("error")
   console.log("not matched");
 }

 });

 router.get("/add-journey", async function (req, res, next){ 


// let idjourney; // récupère l'id du front et stocke dans variable

console.log("matchedeeeee !")
console.log(req.query.id);

console.log(req.session.user);

var user = await userModel.findById(req.session.user.id)
         .populate("journey") // permet de 
         .exec()

         console.log(user);






var journey = await journeyModel.findById(req.query.id)

var oldJourney = user.journey
oldJourney.push(journey)

await userModel.updateOne({_id : req.session.user.id},{journey : oldJourney}) // 1er objet est le filtre, le second remplace l'ancien journey par le nouveau

console.log(user);

  res.render ("mytickets", {journey} )
});


//  var order = await ordersModel.findById(req.query.id)
//  .populate('articles')
//  .exec()

// res.render('order', { order});
// });







 //--------------ERROR-------------//

router.get("/error", function (req, res, next){
  res.render ("error")
})




