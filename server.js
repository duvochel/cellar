const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('node:fs');

const app = require('./app');
const { csvToJson } = require('./utils/csvToJson');
const Bottle = require('./models/bottleModel');

dotenv.config();

const PORT = process.env.PORT;
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
console.log({ DB });
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// Parse CSV synchronously at the start of the app.
const bottles = csvToJson('./devData/bottles.csv');
fs.writeFileSync('./devData/bottles.json', JSON.stringify(bottles), {
  encoding: 'utf-8',
});

(async function initDB() {
  const reset = await Bottle.deleteMany();
  console.log({ reset });
  await Bottle.create(bottles);
  const bottlesLoaded = await Bottle.find().estimatedDocumentCount();
  console.log(`${bottlesLoaded} documents loaded to DB!`);
})();

app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
