const express = require('express');
const router = express.Router();
const {
  exportToJSON,
  importFromJSON,
} = require('../controllers/importexport.controller');

// Route to export data to JSON file
router.get('/export', exportToJSON);

// Route to import data from JSON file
router.get('/import', importFromJSON);

module.exports = router;
