const fs = require('fs');
const Movie = require('../models/movie');

const exportToJSON = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    fs.writeFileSync(
      './exports/movieData.json',
      JSON.stringify(movies, null, 2)
    );
    console.log('Data exported successfully');
    res.status(200).send('Data exported successfully');
  } catch (err) {
    next(err);
  }
};

const importFromJSON = async (req, res, next) => {
  try {
    const data = JSON.parse(fs.readFileSync('./exports/movieData.json'));
    await Movie.deleteMany();
    await Movie.insertMany(data);
    console.log('Data imported successfully');
    res.status(200).send('Data imported successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  exportToJSON,
  importFromJSON,
};
