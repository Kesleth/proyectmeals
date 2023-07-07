const express = require('express');
const userController = require('../controllers/users.controller');

const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');
const userMiddleware = require('../middlewares/users.middleware');

const router = express.Router();

router.post(
  '/signup',
  validationMiddleware.validateAUser,
  userController.createAUser
);

router.post(
  '/login',
  validationMiddleware.validateAUpdate,
  userController.login
);

router.use(authMiddleware.protect);

router.get(
  '/orders/:id',
  userMiddleware.validSession,
  userController.getOrderById
);

router
  .use('/:id', userMiddleware.checkUserExistence)
  .route('/:id')
  .patch(authMiddleware.protectAccountOwner, userController.updateAUser)
  .delete(authMiddleware.protectAccountOwner, userController.deleteAUser);

module.exports = router;
