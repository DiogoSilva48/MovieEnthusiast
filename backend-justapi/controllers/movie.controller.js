const axios = require('axios');

const requestOptions = require('../utils/movieapi.request.options');
const endpoints = require('../utils/movieapi.endpoints');

async function getMovies(req, res) {
  const page = req.query.page || 1;
  try {
    const moviesResponse = await axios(
      requestOptions.getDefaultOptions(endpoints.getMovies(page))
    );
    const movies = moviesResponse.data.results;
    const moviesWithRevenue = await getRevenues(movies);
    const filteredMovies = filterMovies(moviesWithRevenue, page);
    res.status(200).send(filteredMovies);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function getMoviesTopTen(req, res) {
  const year = req.query.year;
  const endpoint =
    year == null || year == undefined
      ? endpoints.getMoviesRevenue()
      : endpoints.getMoviesByYear(year);
  try {
    const moviesResponse = await axios(
      requestOptions.getDefaultOptions(endpoint)
    );
    const movies = moviesResponse.data.results;
    const moviesWithRevenue = await getRevenues(movies);
    const filteredMovies = filterMovies(moviesWithRevenue);
    const firstTenMovies = filteredMovies.slice(0, 10);
    res.status(200).send(firstTenMovies);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function getRevenues(movies) {
  try {
    const moviesWithRevenue = await Promise.all(
      movies.map(async (movie) => {
        const revenueResponse = await axios(
          requestOptions.getDefaultOptions(endpoints.getMovieById(movie.id))
        );
        const revenueData = revenueResponse.data;
        return { ...movie, revenue: revenueData.revenue };
      })
    );
    return moviesWithRevenue;
  } catch (err) {
    console.error('Error fetching revenues:', err);
    return [];
  }
}

async function getMovieInfo(req, res) {
  const movie_id = req.query.movie_id;
  try {
    const movieResponse = await axios(
      requestOptions.getDefaultOptions(endpoints.getMovieById(movie_id))
    );
    const movie = movieResponse.data;
    const moviesWithInfo = await getMovieDetailsById([movie]);
    const filteredMovie = moviesWithInfo.map(changeMovie);
    res.status(200).send(filteredMovie[0]);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function getMovieDetailsById(movies) {
  try {
    const moviesWithDetails = await Promise.all(
      movies.map(async (movie) => {
        const moviesDetails = await axios(
          requestOptions.getDefaultOptions(
            endpoints.getMovieDetailsById(movie.id)
          )
        );
        const moviesInfo = moviesDetails.data;
        return { ...movie, info: moviesInfo };
      })
    );
    return moviesWithDetails;
  } catch (err) {
    console.error('Error fetching movie details:', err);
    return [];
  }
}

const filterMovies = (movies, page = 1) => {
  const startIndex = page > 1 ? (page - 1) * 20 : 0;
  return movies.map((movie, index) => ({
    index: index + 1 + startIndex,
    title: movie.title,
    id: movie.id,
    year: movie.release_date.split('-')[0],
    revenue: movie.revenue,
  }));
};

const changeMovie = (movie) => {
  try {
    const title = movie.title;
    const year = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : '';
    const genres = movie.genres ? movie.genres.map((genre) => genre.name) : [];
    const description = movie.overview;

    let directors = [];
    const directorData =
      movie.info &&
      movie.info.crew.filter((member) => member.job === 'Director');
    if (directorData) {
      directors = directorData.map((director) => director.name);
    }

    let actors = [];
    const actorsData =
      movie.info &&
      movie.info.cast
        .filter((member) => member.known_for_department === 'Acting')
        .slice(0, 4);
    if (actorsData) {
      actors = actorsData.map((actor) => actor.name);
    }

    const rating = movie.vote_average;
    const votes = movie.vote_count;
    const revenue = movie.revenue;
    const runtime = movie.runtime;

    const simplifiedMovie = {
      title,
      year,
      genres,
      description,
      directors,
      actors,
      rating,
      votes,
      revenue,
      runtime,
    };

    return simplifiedMovie;
  } catch (err) {
    console.error('Error filtering movie:', err);
    return null;
  }
};

module.exports = {
  getMovies: getMovies,
  getMoviesTopTen: getMoviesTopTen,
  getMovieInfo: getMovieInfo,
};
