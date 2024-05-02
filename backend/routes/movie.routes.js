const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');

router.get('/moviesTop', movieController.getMoviesTopTen);
router.get('/moviesDetails', movieController.getMovieInfo);
router.get('/fetchMovieDetails', movieController.fetchMovieDetails);
router.get('/movies', movieController.getMovies);

module.exports = router;
