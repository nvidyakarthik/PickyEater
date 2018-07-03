import axios from "axios";
const APIKEY = "";

export default {
  // Gets all restaurant info from api
  /* getRestaurants: function(topic,startdate,enddate) {
    return axios.get("/api/restaurants" , { params:
   { 
      q: topic,
      begin_date:startdate+"0101",
      end_date:enddate+"0101",
      'api-key':APIKEY } 
    });
  },*/
  //get all categories name
  getCategories: function() {
    return axios.get("/api/restaurant/categories");
  },
  /*
  //search restaurant by name/lists all menus here
  getRestaurantById: function(id) {
    return axios.get("/api/restaurants/"+id);
  },
   //search restaurant by category name
   getRestaurantByCategory: function(category) {
    return axios.get("/api/restaurants/"+category);
  },
   //search restaurant by category name
   getRestaurantByRating: function() {
    return axios.get("/api/restaurants/rating");
  }, */
    // Login page Saves the user to the database
  saveUser: function(userData) {
    return axios.post("/api/user", userData);
  },
  saveRestaurant: function(restaurantData) {
    return axios.post("/api/restaurant", restaurantData);
  },
 /*  //user login info
  getUser:function(){
    return axios.get("/api/user")
  },*/
  getAllComments:function(restId){
    return axios.get("/api/restaurant/comment/"+restId);
  }, 
  saveComment:function(commentData,restId){
    return axios.post("/api/restaurant/comment/"+restId, commentData);
  }  
};
