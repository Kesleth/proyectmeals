const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const generateJWT = require('../utils/JWT');

const UserModel = require('../models/users.models');

exports.createAUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);
  const user = await UserModel.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message: 'New user has been created successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    where: {
      email: email.toLowerCase(),
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.userOrders = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    results: user.orders.length,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    orders: user.orders,
    meals: user.meals,
    restaurants: user.restaurants,
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const filteredOrder = user.orders.filter((order) => order.id === id);

  if (!filteredOrder) {
    return next(new AppError(`Order with id:${id} does not exist`));
  }

  res.status(200).json({
    status: 'success',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    order: filteredOrder,
  });
});

exports.updateAUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  return res.status(200).json({
    status: 'success',
    message: `User with id:${user.id} has been updated ✨`,
    user: {
      name,
      email,
    },
  });
});

exports.deleteAUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'disabled' });

  res.status(200).json({
    status: 'success',
    message: `User with id:${user.id} has been deleted 💨`,
  });
});
