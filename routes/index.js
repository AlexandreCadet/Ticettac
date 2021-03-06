var express = require('express');
var router = express.Router();
var connection = require("../models/connection");


var userModel = require('../models/user');
var journeyModel = require('../models/journey');

const mongoose = require('mongoose');





/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.basket===undefined){
    req.session.basket= [];
  }
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
    console.log(req.session.user);
    console.log("match user");

    res.render("ticket",{user : req.session.user})
  } else { // si user n'existe pas, execute le code si dessous
    console.log("not matched");
    res.redirect('/')
  }

});


router.post('/search', async function(req, res, next) {

var basketCard = await journeyModel.find({departure : req.body.departure, arrival : req.body.arrival, date : req.body.date});


 if(basketCard !== null){

  console.log("matched !");   

   res.render("ticketcard",{ basketCard});


 } else {
   res.render("error")
   console.log("not matched");
 }

 });

 router.get("/basket", async function (req, res, next){ 
  var journey= await journeyModel.findById(req.query.id);
  
  let alreadyExist = false;


  for (let i= 0;i<req.session.basket.length;i++){
      if(req.query.id === req.session.basket[i].id){
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



  

  res.render ("mytickets", {basket : req.session.basket} )
});






//----------confirmer le voyage de l'utilisateur : push de son voyage dans userModel------------//

router.get('/confirm', async function(req, res, next) {


  var user = await userModel.findById(req.session.user.id)
  
  var oldJourney = user.journey

  for(i=0;i<req.session.basket.length;i++){

   oldJourney.push(req.session.basket[i].id)
  }

  await userModel.updateOne({_id : req.session.user.id},{ journey : oldJourney})
   // 1er objet est le filtre, le second remplace l'ancien journey par le nouveau
   req.session.basket = []; // vide le panier
  
  res.render('confirmation');

});
 

//------affichage du tableau journey de user--------------//

router.get("/mylastTrip", async function (req,res,next){


  var user = await userModel.findById(req.session.user.id).populate('journey').exec()

  
    if(user.journey.length ===0){

      res.redirect("/error")
    } else {

      res.render("mylastTrip",{userJourney:user.journey})

  }
});
    


  

 //--------------ERROR-------------//

 router.get("/error", function (req, res, next){
  res.render ("error")
})