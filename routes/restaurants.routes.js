const express = require('express');
const restaurantsController = require('../controllers/restaurants.controller');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const restaurantMiddleware = require('../middlewares/restaurants.middleware');
const reviewMiddleware = require('../middlewares/review.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router
  .route('/')
  .get(restaurantsController.getAllRestaurants)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    validationMiddleware.validRestaurants,
    restaurantsController.addRestaurant
  );

router
  .route('/:id')
  .get(
    restaurantMiddleware.checkRestaurantExistence,
    restaurantsController.getRestaurantById
  )

  .patch(
    restaurantMiddleware.checkRestaurantExistence,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    restaurantsController.updateRestaurantDetails
  )

  .delete(
    restaurantMiddleware.checkRestaurantExistence,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    restaurantsController.deleteRestaurant
  );

router.use(authMiddleware.protect);

router.post(
  '/reviews/:id',
  restaurantMiddleware.checkRestaurantExistence,
  reviewController.createReview,
  validationMiddleware.validationReview
);

router
  .use(
    '/reviews/:restaurantId/:id',
    reviewMiddleware.checkReviewExistence,
    restaurantMiddleware.checkRestaurantExistence
  )
  .route('/reviews/:restaurantId/:id')
  .patch(
    validationMiddleware.validationReview,
    authMiddleware.protectAccountOwner,
    reviewController.updateAReview
  );

module.exports = router;
