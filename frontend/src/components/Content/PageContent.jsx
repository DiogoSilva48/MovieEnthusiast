import { useState, useEffect, useRef } from 'react';
import YearModal from './YearModal';
import MovieModal from './MovieModal';
import { FaUndoAlt } from 'react-icons/fa';
import fetchData from './fetchMovies';
import Table from './Table';

const PageContent = () => {
  const [movies, setMovies] = useState([]);
  const [activeTop10, setActiveTop10] = useState(false);
  const [showSelectYear, setShowSelectYear] = useState(false);
  const [selectedYear, setSelectedYear] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const loader = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loader.current);

    return () => observer.disconnect();
  }, [hasMore]);

  useEffect(() => {
    setPage(1);
  }, [activeTop10, selectedYear]);

  useEffect(() => {
    fetchData(page, activeTop10, selectedYear, setMovies, setHasMore);
  }, [activeTop10, selectedYear, page]);

  const handleMovieClick = (movieId) => {
    setSelectedMovie(movieId);
    setShowMovieModal(true);
  };

  return (
    <div className="flex flex-col items-start justify-center max-w-screen-lg mx-auto mt-6">
      <span className="mb-8 text-2xl text-customBlueTitle">Movie ranking</span>
      <div className="flex items-center mb-8 relative">
        <button
          className={`rounded-full border text-sm py-1 px-3 mr-4 ${
            activeTop10
              ? 'bg-customBlueButtonActive text-white'
              : 'bg-transparent'
          }`}
          onClick={() => {
            setActiveTop10(true);
            setShowSelectYear(false);
            setSelectedYear(false);
          }}
        >
          Top 10 Revenue
        </button>
        <button
          className={`rounded-full border text-sm py-1 px-3 ${
            showSelectYear || selectedYear !== false
              ? 'bg-customBlueButtonActive text-white'
              : 'bg-transparent'
          }`}
          onClick={() => {
            setActiveTop10(false);
            setShowSelectYear(true);
          }}
        >
          {selectedYear !== false
            ? `Top 10 Revenue ${selectedYear}`
            : 'Top 10 Revenue per Year'}
        </button>

        {(activeTop10 || selectedYear !== false) && (
          <button
            className=" text-gray-500 py-1 px-3 ml-2"
            onClick={() => {
              setActiveTop10(false);
              setSelectedYear(false);
              setPage(1);
              setMovies([]);
              setHasMore(true);
            }}
          >
            <FaUndoAlt />
          </button>
        )}
        {showSelectYear && (
          <div className="absolute right-0 mt-2">
            <YearModal
              show={showSelectYear}
              onHide={() => setShowSelectYear(false)}
              onSelectYear={(year) => {
                setSelectedYear(year);
                setShowSelectYear(false);
                setPage(1);
                setMovies([]);
                setHasMore(false);
              }}
            />
          </div>
        )}
      </div>
      <Table
        movies={movies}
        handleMovieClick={handleMovieClick}
        headerTexts={['RANKING', 'TITLE', 'YEAR', 'REVENUE', '']}
      />

      <div ref={loader} className="loader" />
      {showMovieModal && (
        <MovieModal
          movieId={selectedMovie}
          onClose={() => setShowMovieModal(false)}
        />
      )}
    </div>
  );
};

export default PageContent;
