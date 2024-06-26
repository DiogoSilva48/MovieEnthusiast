require('dotenv').config({ path: './.env' });

const express = require('express');

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
require('./loader.js');
