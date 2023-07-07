const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const ratelimit = require('express-rate-limit');
const morgan = require('morgan');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHndler = require('./controllers/error.controller');
const userRoutes = require('./routes/user.routes');
const restaurantRoutes = require('./routes/restaurants.routes');
const ordersRoutes = require('./routes/orders.routes');
const maelsRoutes = require('./routes/meals.routes');

const app = express();

const routes = {
  users: '/api/v1/users',
  restaurants: '/api/v1/restaurants',
  orders: '/api/v1/orders',
  meals: '/api/v1/meals',
};

const limiter = ratelimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: 'High request volume. Please try again later.',
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(xss());
app.use(hpp());

app.use('/api/v1', limiter);

app.use(routes.users, userRoutes);
app.use(routes.restaurants, restaurantRoutes);
app.use(routes.orders, ordersRoutes);
app.use(routes.meals, maelsRoutes);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server! 💣💣 `, 404)
  );
});

app.use(globalErrorHndler);

module.exports = app;
