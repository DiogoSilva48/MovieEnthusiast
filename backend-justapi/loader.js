const app = require('./index');
const express = require('express');

const moveRoutes = require('./routes/movie.routes');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use('/api', moveRoutes);
