const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  directors: {
    type: [String],
    required: true,
  },
  actors: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  votes: {
    type: Number,
    required: true,
  },
  revenue: {
    type: Number,
  },
  runtime: {
    type: Number,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
