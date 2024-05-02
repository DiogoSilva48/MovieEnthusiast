const API_KEY = process.env.API_KEY;

const getDefaultOptions = (url) => {
  return {
    method: 'GET',
    url: url,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  };
};

module.exports = {
  getDefaultOptions: getDefaultOptions,
};
