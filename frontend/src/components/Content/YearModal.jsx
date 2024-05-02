const YearModal = ({ show, onHide, onSelectYear }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1935 + 1 },
    (_, index) => 1935 + index
  ).reverse();

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        show ? 'block' : 'hidden'
      }`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div
          className="inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onHide}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="inline-block bg-white px-4 pb-4 overflow-y-auto shadow-xl transform transition-all"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          style={{
            maxWidth: 'max-content',
            maxHeight: '50vh',
          }}
        >
          <div className="mt-3 text-center">
            <span
              className="text-xs font-medium text-gray-500"
              id="modal-headline"
            >
              SELECT YEAR
            </span>
            <div className="mt-2">
              {years.map((year) => (
                <div key={year} className="mb-2">
                  <a
                    className="inline-flex items-center px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-white hover:text-gray-500 focus:outline-none"
                    onClick={() => onSelectYear(year)}
                  >
                    {year}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearModal;
