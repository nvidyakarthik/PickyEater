const db = require("../models");
const axios=require("axios");
const mongoose = require("mongoose");
const ObjectId=mongoose.Types.ObjectId;


 //Defining methods for the booksController
module.exports = {

  createRestaurant: function(req, res) {
    //req.body.imgpath=req.file.filename;
    console.log("Inside create restaurant"+JSON.stringify(req.body));
    db.Restaurant
      .create(req.body)
      .then(dbModel => {
         res.json(dbModel);
        
      })
      .catch(err => res.status(422).json(err));
  },
  updateRestMenu: function (req, res) {
     db.Restaurant.findOneAndUpdate({ _id: req.params.id },
        { $push: { menus: req.body.menus } },
        { new: true })
        
        .then(dbRestaurant => {
          console.log(dbRestaurant);
            res.json(dbRestaurant);

        })
        .catch(err => {
            console.log(err);
            res.status(422).json(err);

        });
}, 
  findAllCategories: function(req, res) {
    db.Category
      .find(req.query)
      .then(dbCategories => res.json(dbCategories))
      .catch(err => res.status(422).json(err));
  },
  //search by restaurant name   
  findRestaurantById: function(req, res) {
    db.Restaurant
      .findById({ _id: req.params.id })
      .populate("menus")
      .populate("category")
      .then(dbRestaurant => res.json(dbRestaurant))
      .catch(err => res.status(422).json(err));
  },
  findRestByNameCity: function(req, res) {
    console.log("in findrestbynamecity"+req.body.restaurantName);
    console.log("city"+req.body.city);
    db.Restaurant
      //.find({"restaurantName": {$regex : `^${req.body.restaurantName}.*` , $options: 'si' }})
      .find({ $and: [{"restaurantName":{ $eq: req.body.restaurantName}}, { "city": { $eq: req.body.city } } ] })
      
      .then(dbRestaurant =>{ 
        console.log(dbRestaurant);
        res.json(dbRestaurant);})
      .catch(err => {
        console.log(err);
         res.status(422).json({err:db.Restaurant.toString()});
      });
  },
  //find restaurant by
  findRestByCategory: function(req, res) {
    console.log("in findRestByCategory"+req.params.id);
    db.Restaurant    
      .find({ category:{ _id : req.params.id}})
      .populate("category")
      //.populate("category menus")
      .then(dbRestaurant => res.json(dbRestaurant))
      .catch(err => res.status(422).json(err));
  },
  //returns average of menu rating
  findRestByRating: function(req, res) {
    console.log("inside here");
    db.Menu.aggregate(
      [
        {
          $match:{
              "_id" : ObjectId("5b4931a8636f94d25c24a292")
          }
      },
       // Unwind the source
       { $unwind: "$comments" },
       // Do the lookup matching
       { $lookup: {
          "from": "comments",//other table name
          "localField": "comments",
          "foreignField": "_id",
          "as": "commentObjects"
       }},
       // Unwind the result arrays ( likely one or none )
        { $unwind: "$commentObjects" }, 
       // Group back to arrays
       { $group: {
           _id: "$_id",           
           averageRating:{"$avg":{"$sum": '$commentObjects.rating' }},
           commentObjects: { "$push": "$commentObjects" }
       }}
   ])
      .then(dbRestaurant =>{ 
        console.log(dbRestaurant);
        res.json(dbRestaurant)})
      .catch(err => res.status(422).json(err));
  },
  //search all restaurant by zip
  searchRest: function(req,res){
     axios
    .get("https://api.foursquare.com/v2/venues/search",{ params: req.query})
    .then(({ data: { response } }) => {
      res.json(response)
    })
    .catch(err => {
      console.log(err);
      res.status(422).json(err)});

  }

};


//session stored 
/* var estLat = sessionStorage.getItem("startLat");
var estlng = sessionStorage.getItem("startLng");

function foursquareSearch (category, loc, rad){
  let apiString='https://api.foursquare.com/v2/venues/search?';
  const clientID = '&client_id=WPAVV4TBTN0WB1AMQAZG5XTQFJ5AQ2EBWJPLU4Z1PSGAZLVC'
  const clientSecret = '&client_secret=2JYX2TBCNACXMXOUXCVOM5DALR4F4ZZ5H3L35PZ1I54OVP1U'
  const version = '&v=20170801'
 let resturantApi= 'https://api.foursquare.com/v2/venues/';
  let location = string('&near'=+loc);
  let radius = string('&radius='+rad);
  let categoryID = '&categoryId='+ category;
  const limit = '&limit=10';

  console.log(apiString);
    $.ajax({
      url: apitstring+clientID+clientSecret+version+location+radius+categoryID+limit,
      method:'GET'
    }).then(result => {
      let venues = results.response.venues;
      console.log(venues);
      console.log(venues.id);
    console.log(resturantApi+venues.id+'/'+menu)
    })
  
}

 foursquareSearch{
  console.log(results.response.venues)
};
 */