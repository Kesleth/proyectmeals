const UserModel = require('../models/users.models');
const MealModel = require('./meals.models');
const OrderModel = require('./orders.models');
const RestaurantModel = require('./restaurants.models');
const ReviewModel = require('./reviews.models');

const initModel = () => {
  UserModel.hasMany(Order);
  OrderModel.belongsTo(User);

  UserModel.hasMany(Review);
  ReviewModel.belongsTo(User);

  RestaurantModel.hasMany(Review);
  ReviewModel.belongsTo(Restaurant);

  RestaurantModel.hasMany(Meal);
  MealModel.belongsTo(Restaurant);

  MealModel.hasOne(Order);
  OrderModel.belongsTo(Meal);
};

module.exports = initModel;
