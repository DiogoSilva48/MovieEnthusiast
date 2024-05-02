import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const MovieModal = ({ movieId, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);

  const serverHost = 'http://localhost:3000/api';

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          serverHost + `/moviesDetails?movie_id=${movieId}`
        );
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();

    return () => {};
  }, [movieId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-gray-500 opacity-75"
        onClick={onClose}
      ></div>
      <div className="bg-white overflow-hidden z-10 max-w-2xl w-full">
        <div className="p-8 lg:px-8">
          {movieDetails && (
            <>
              <div className="flex justify-between mb-4">
                <span className="text-4xl font-thin text-customBlueTitle">
                  {movieDetails.title}
                </span>
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={onClose}
                >
                  <button className="text-2xl font-thin">
                    <FaTimes className="text-gray-500 hover:text-gray-700" />
                  </button>
                  <span className="text-xs text-gray-500 hover:text-gray-700">
                    Close
                  </span>
                </div>
              </div>
              <div className="mb-4 left-0 w-1/5 h-0.5 bg-customBlueButtonActive"></div>
              <div className="flex flex-col mb-2">
                <div className="flex flex-col mb-4">
                  <span className="flex justify-start text-sm text-gray-400">
                    Year
                  </span>
                  <span className="flex justify-start text-gray-600">
                    {movieDetails.year}
                  </span>
                </div>
                <div className="flex flex-col mb-4">
                  <span className="flex justify-start text-sm text-gray-400">
                    Genre
                  </span>
                  <span className="flex justify-start text-gray-600">
                    {movieDetails.genres.join(', ')}
                  </span>
                </div>
                <div className="flex flex-col mb-4">
                  <span className="flex justify-start text-sm text-gray-400">
                    Description
                  </span>
                  <span className="flex text-gray-600">
                    {movieDetails.description}
                  </span>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="flex flex-col mb-4">
                  <span className="text-sm text-gray-400">Director</span>
                  <span className="text-customBlueButtonActive">
                    {movieDetails.directors.join(', ')}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">Actors</span>
                  <span className="text-customBlueButtonActive">
                    {movieDetails.actors.join(', ')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col mb-4">
                  <span className="flex justify-start text-sm text-gray-400">
                    Runtime
                  </span>
                  <span className="flex justify-start text-gray-600">
                    {movieDetails.runtime} mins
                  </span>
                </div>
                <div className="flex flex-col mb-4">
                  <span className="flex justify-start text-sm text-gray-400">
                    Rating
                  </span>
                  <span className="flex justify-start text-gray-600">
                    {movieDetails.rating}
                  </span>
                </div>
                <div className="flex flex-col mb-4">
                  <span className="flex justify-start text-sm text-gray-400">
                    Votes
                  </span>
                  <span className="flex text-gray-600">
                    {movieDetails.votes}
                  </span>
                </div>
                <div className="flex flex-col mb-2">
                  <span className="flex justify-start text-sm text-gray-400">
                    Revenue
                  </span>
                  <span className="flex text-gray-600">
                    {movieDetails.revenue
                      ? `$${movieDetails.revenue.toLocaleString('en-US')}`
                      : 'Not Available'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
