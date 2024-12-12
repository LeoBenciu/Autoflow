const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./db');
const port = 3000;
const carsRouter = require('./routes/cars');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.use('/cars', carsRouter);


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  });