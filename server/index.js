require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const port = 3000;
const carsRouter = require('./routes/cars');
const savedRouter = require('./routes/saved');
const usersRouter = require('./routes/users');
const conversationsRouter = require('./routes/conversations');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./strategies/local-strategy');
const initializeGoogleStrategy = require('./strategies/google-strategy');

initializePassport();
initializeGoogleStrategy();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'sadfsdsdv2fg',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(morgan('combined'));

app.use('/cars', carsRouter);
app.use('/saved', savedRouter);
app.use('/users', usersRouter);
app.use('/conversations', conversationsRouter);


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  });