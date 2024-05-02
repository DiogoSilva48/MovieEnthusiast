const axios = require('axios');
const Movie = require('../models/movie');
const requestOptions = require('../utils/movieapi.request.options');
const endpoints = require('../utils/movieapi.endpoints');

const getMovieDetailsById = async (movieId) => {
  try {
    const moviesDetails = await axios(
      requestOptions.getDefaultOptions(endpoints.getMovieById(movieId))
    );
    return moviesDetails.data;
  } catch (err) {
    console.error('Error fetching movie details:', err);
    return null;
  }
};

const getMovieCreditsById = async (movieId) => {
  try {
    const moviesDetails = await axios(
      requestOptions.getDefaultOptions(endpoints.getMovieCreditsById(movieId))
    );
    return moviesDetails.data;
  } catch (err) {
    console.error('Error fetching movie credits:', err);
    return null;
  }
};

const createSimplifiedMovie = (movie, movieDetails, movieCredits) => {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : '';
  const directors = movieCredits.crew
    .filter((member) => member.job === 'Director')
    .map((director) => director.name);
  const actors = movieCredits.cast
    .filter((member) => member.known_for_department === 'Acting')
    .slice(0, 4)
    .map((actor) => actor.name);

  const description = movie.overview ? movie.overview : 'Not Available';

  return {
    movieId: movie.id,
    title: movie.title,
    year: year,
    genres: movieDetails.genres
      ? movieDetails.genres.map((genre) => genre.name)
      : [],
    description: description,
    directors: directors,
    actors: actors,
    rating: movie.vote_average,
    votes: movie.vote_count,
    revenue: movieDetails.revenue,
    runtime: movieDetails.runtime,
  };
};

const fetchMovieDetails = async (req, res) => {
  try {
    const pages = 50; // Total pages for the first loop
    const currentYear = new Date().getFullYear();

    const progress = {
      fetchingMovies: true,
      totalMoviesProcessed: 0,
    };

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    sendProgressUpdate(progress, res);

    for (let page = 1; page <= pages; page++) {
      const moviesResponse = await axios(
        requestOptions.getDefaultOptions(endpoints.getMovies(page))
      );
      const movies = moviesResponse.data.results;

      for (const movie of movies) {
        progress.totalMoviesProcessed++;
        sendProgressUpdate(progress, res);

        const movieDetails = await getMovieDetailsById(movie.id);
        const movieCredits = await getMovieCreditsById(movie.id);

        if (movieDetails && movieCredits) {
          const simplifiedMovie = createSimplifiedMovie(
            movie,
            movieDetails,
            movieCredits
          );
          await saveMovieToDB(simplifiedMovie);
        }
      }
    }

    for (let year = 1935; year <= currentYear; year++) {
      const moviesResponse = await axios(
        requestOptions.getDefaultOptions(endpoints.getMoviesByYear(year))
      );
      const topMovies = moviesResponse.data.results.slice(0, 10);

      for (const movie of topMovies) {
        progress.totalMoviesProcessed++;
        sendProgressUpdate(progress, res);

        const movieDetails = await getMovieDetailsById(movie.id);
        const movieCredits = await getMovieCreditsById(movie.id);

        if (movieDetails && movieCredits) {
          const simplifiedMovie = createSimplifiedMovie(
            movie,
            movieDetails,
            movieCredits
          );
          await saveMovieToDB(simplifiedMovie);
        }
      }
    }

    console.log('All movies saved to database');

    progress.fetchingMovies = false;
    sendProgressUpdate(progress, res);
    res.end();
  } catch (err) {
    console.error('Error fetching and saving movies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const sendProgressUpdate = (progress, res) => {
  res.write(`data: ${JSON.stringify({ progress })}\n\n`);
};

const saveMovieToDB = async (movieDetails) => {
  try {
    const existingMovie = await Movie.findOne({
      movieId: movieDetails.movieId,
    });
    if (!existingMovie) {
      const movie = new Movie(movieDetails);
      await movie.save();
      console.log(`Saved movie: ${movieDetails.title}`);
    } else {
      console.log(`Movie already exists: ${movieDetails.title}`);
    }
  } catch (err) {
    console.error('Error saving movie to MongoDB:', err);
  }
};

const getMovieInfo = async (req, res) => {
  const { movie_id } = req.query;
  try {
    const movie = await Movie.findOne({ movieId: movie_id });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const details = {
      title: movie.title,
      year: parseInt(movie.year),
      genres: movie.genres ? movie.genres : [],
      description: movie.description ? movie.description : 'Not Available',
      directors: movie.directors ? movie.directors : [],
      actors: movie.actors ? movie.actors : [],
      rating: movie.rating ? parseFloat(movie.rating) : null,
      votes: movie.votes ? parseInt(movie.votes) : null,
      revenue: movie.revenue ? parseInt(movie.revenue) : null,
      runtime: movie.runtime ? parseInt(movie.runtime) : null,
    };

    res.status(200).json(details);
  } catch (err) {
    console.error('Error fetching movie details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMovies = async (req, res) => {
  try {
    const { page } = req.query;
    if (!page || isNaN(page)) {
      return res.status(400).json({ error: 'Invalid page number' });
    }

    const pageNumber = parseInt(page);
    const movies = await getMoviesFromMongoDBByPage(pageNumber);
    if (!movies) {
      return res.status(500).json({ error: 'Failed to fetch movies' });
    }

    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMoviesTopTen = async (req, res) => {
  const { year } = req.query;
  try {
    let movies;
    if (year) {
      movies = await Movie.find({ year }).sort({ revenue: -1 }).limit(10);
    } else {
      movies = await Movie.find().sort({ revenue: -1 }).limit(10);
    }

    const top10Movies = movies.map((movie, index) => ({
      index: index + 1,
      title: movie.title,
      id: movie.movieId,
      year: movie.year.toString(),
      revenue: movie.revenue,
    }));

    res.status(200).json(top10Movies);
  } catch (err) {
    console.error('Error fetching top 10 movies by revenue:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMoviesFromMongoDBByPage = async (pageNumber) => {
  try {
    const pageSize = 20;
    const skip = (pageNumber - 1) * pageSize;
    const movies = await Movie.find().skip(skip).limit(pageSize).exec();

    const transformedMovies = movies.map((movie, index) => ({
      index: skip + index + 1,
      title: movie.title,
      id: movie.movieId,
      year: movie.year.toString(),
      revenue: movie.revenue,
    }));

    return transformedMovies;
  } catch (err) {
    console.error('Error fetching movies from MongoDB:', err);
    return null;
  }
};

module.exports = {
  fetchMovieDetails,
  getMovies,
  getMoviesTopTen,
  getMovieInfo,
};
