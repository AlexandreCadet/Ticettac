var express = require('express');
var router = express.Router();
var connection = require("../models/connection");


var userModel = require('../models/user');
var journeyModel = require('../models/journey');

const mongoose = require('mongoose');





/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('login', { title: 'Express', basket : req.session.basket });
});

module.exports = router;

/* GET SIGN-UP */



router.post('/sign-up', async function (req, res, next){
  var searchUser = await userModel.findOne({
    email: req.body.email
  })
  
  if(!searchUser){
  var newUser = new userModel({

    name: req.body.name,
    firstName : req.body.firstName,
    email : req.body.email,
    password : req.body.password,
    journey : []
  });

  var newUser = await newUser.save();
}
else{
  res.redirect('/');
}
  
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


router.post('/search', async function(req, res, next) {

var basket = await journeyModel.find({departure : req.body.departure, arrival : req.body.arrival, date : req.body.date});


 if(basket !== null){

  console.log("matched !");   

   res.render("ticketcard",{ basket});


 } else {
   res.render("error")
   console.log("not matched");
 }

 });

 router.get("/basket", async function (req, res, next){ 
  if (req.session.basket===undefined){
    req.session.basket= [];
  }
  let alreadyExist = false;


  for (let i=0;i<req.session.basket.length;i++){
      if(req.query.id === journey._id){
        alreadyExist = true;
        
      }
  }
  if(alreadyExist==false){
      req.session.basket.push({
        departure : journey.departure,
        arrival : journey.arrival,
        departureTime : journey.departureTime,
        price : journey.price,
        date : journey.date,
        id : journey._id,
    
      })


} 

    
// var journey = await journeyModel.findById(req.query.id)
// console.log(journey);
// req.session.basket.push(journey)

//   var user = await userModel.findById(req.session.user.id)
//          .populate("journey") // permet de 
//          .exec()

//          console.log(user);






// var journey = await journeyModel.findById(req.query.id)


// var oldJourney = user.journey
// oldJourney.push(journey)

// await userModel.updateOne({_id : req.session.user.id},{journey : oldJourney}) // 1er objet est le filtre, le second remplace l'ancien journey par le nouveau



  




  res.render ("mytickets", {basket : req.session.basket} )
});








 //--------------ERROR-------------//

router.get("/error", function (req, res, next){
  res.render ("error")
})




router.get('/confirm', async function(req, res, next) {

  var user = await userModel.findById(req.session.user.id)
          .populate("journey") 
          .exec()
  
  console.log("console log de user");
  console.log(user);
  console.log(req.session.basket._id);
  var journey = await journeyModel.findById(req.session.basket._id)
  
  console.log("console log de journey");
  console.log(journey);
  
  var oldJourney = user.journey
   oldJourney.push(journey)
  
  await userModel.updateOne({_id : req.session.user.id},{journey : oldJourney}) // 1er objet est le filtre, le second remplace l'ancien journey par le nouveau
  
  


  res.render('confirmation');

});


