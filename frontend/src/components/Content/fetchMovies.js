// fetchMovies.js

const serverHost = 'http://localhost:3000/api';

const fetchData = async (
  page,
  activeTop10,
  selectedYear,
  setMovies,
  setHasMore
) => {
  try {
    let url = serverHost + '/movies?page=' + page;
    if (activeTop10) {
      url = serverHost + '/moviesTop';
    } else if (selectedYear !== false) {
      setMovies([]);
      url = serverHost + `/moviesTop?year=${selectedYear}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    console.log('Fetched data:', data);

    if (activeTop10 || selectedYear !== false) {
      setMovies(data);
      setHasMore(false);
    } else {
      setMovies((prevMovies) => [
        ...prevMovies,
        ...data.filter(
          (movie) => !prevMovies.some((prevMovie) => prevMovie.id === movie.id)
        ),
      ]);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

export default fetchData;
