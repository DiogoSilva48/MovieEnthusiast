const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');

router.get('/movies', movieController.getMovies);
router.get('/moviesTop', movieController.getMoviesTopTen);
router.get('/moviesDetails', movieController.getMovieInfo);

module.exports = router;
