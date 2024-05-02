const axios = require('axios');
const {
  fetchMovieDetails,
  getMovieDetailsById,
  getMovieCreditsById,
  createSimplifiedMovie,
} = require('./movie.controller');

// Mock the axios module
jest.mock('axios');

describe('fetchMovieDetails function', () => {
  // Mock getMovieDetailsById and getMovieCreditsById
  jest.mock('./movie.controller', () => ({
    ...jest.requireActual('./movie.controller'), // Use the actual implementation for other functions
    getMovieDetailsById: jest.fn(),
    getMovieCreditsById: jest.fn(),
  }));

  const mockResponse = {
    data: {
      results: [{ id: 1 }, { id: 2 }],
    },
  };

  beforeEach(() => {
    axios.mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch and save movies correctly', async () => {
    // Mock getMovieDetailsById and getMovieCreditsById responses
    getMovieDetailsById.mockResolvedValue({});
    getMovieCreditsById.mockResolvedValue({});

    // Mock saveMovieToDB function if needed
    // jest.mock('../models/movie', () => ({
    //   saveMovieToDB: jest.fn(),
    // }));

    const req = {};
    const res = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    await fetchMovieDetails(req, res);

    expect(getMovieDetailsById).toHaveBeenCalledTimes(2);
    expect(getMovieCreditsById).toHaveBeenCalledTimes(2);
    // Add more assertions as needed
  });

  test('should handle errors', async () => {
    // Mock getMovieDetailsById to throw an error
    getMovieDetailsById.mockRejectedValue(
      new Error('Error fetching movie details')
    );

    const req = {};
    const res = {
      setHeader: jest.fn(),
      status: jest.fn(),
      json: jest.fn(),
    };

    await fetchMovieDetails(req, res);

    expect(getMovieDetailsById).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    // Add more assertions as needed
  });
});

// Add more describe blocks and tests for other functions in movie.controller if needed
