const app = require('./index');
const express = require('express');

const movieRoutes = require('./routes/movie.routes');
const importexportRoutes = require('./routes/importexport.routes');

const { connectToMongoDB, closeMongoDBConnection } = require('./config/db');

let db;

async function run() {
  try {
    db = await connectToMongoDB();
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

run().catch(console.error);

process.on('SIGINT', async () => {
  console.log('Received SIGINT signal. Closing MongoDB connection...');
  if (db) {
    await closeMongoDBConnection();
  }
  process.exit(0);
});

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

app.use('/api', movieRoutes);
app.use('/api', importexportRoutes);
