// Table.jsx
import { FaEye } from 'react-icons/fa';

const Table = ({ movies, handleMovieClick, headerTexts }) => {
  return (
    <table className="w-full border border-collapse rounded-lg overflow-hidden ">
      <thead>
        <tr className="border-b border-customBlueTable">
          {headerTexts.map((text, index) => (
            <th
              key={index}
              className="px-4 py-2 text-customBlueTable text-left"
            >
              {text}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {movies.map((movie, index) => (
          <tr key={movie.id} className="border-b border-gray-300">
            <td className="px-4 py-3 text-customBlueTableText text-left">
              {index + 1}
            </td>
            <td className="px-4 py-3 text-customBlueTableText text-left">
              {movie.title}
            </td>
            <td className="px-4 py-3 text-customBlueTableText text-left">
              {movie.year}
            </td>
            <td className="px-4 py-3 text-customBlueTableText text-left">
              {movie.revenue
                ? `$${movie.revenue.toLocaleString('en-US')}`
                : 'Not Available'}
            </td>
            <td className="px-4 py-3 text-customBlueTableText text-left">
              <FaEye onClick={() => handleMovieClick(movie.id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
