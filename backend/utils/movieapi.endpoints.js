const hostName = 'https://api.themoviedb.org/3/';

const getMovies = (page) => {
  return `${hostName}/discover/movie?sort_by=revenue.desc&page=${page}`;
};

const getMovieById = (movieId) => {
  return `${hostName}/movie/${movieId}`;
};

const getMoviesRevenue = () => {
  return `${hostName}/discover/movie?sort_by=revenue.desc`;
};

const getMoviesByYear = (year) => {
  return `${hostName}/discover/movie?sort_by=revenue.desc&primary_release_year=${year}`;
};

const getMovieCreditsById = (movieId) => {
  return `${hostName}/movie/${movieId}/credits`;
};

module.exports = {
  getMovies: getMovies,
  getMovieById: getMovieById,
  getMoviesByYear: getMoviesByYear,
  getMoviesRevenue: getMoviesRevenue,
  getMovieCreditsById: getMovieCreditsById,
};
