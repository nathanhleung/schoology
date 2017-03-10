const pg = require('pg');

pg.defaults.ssl = true;

pg.connect(process.env.DATABASE_URL, (err, client) => {
  if (err) {
    throw err;
  }

  console.log('Connected to postgres!');
});
