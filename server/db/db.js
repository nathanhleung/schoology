const pg = require('pg');

pg.defaults.ssl = true;

function query(text, values, cb) {
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    if (err) {
      return console.log(err);
    }
    client.query(text, values, (err, result) => {
      done();
      cb(err, result);
    });
  });
}

function getSchemas() {
  query('SELECT table_schema,table_name FROM information_schema.tables;', [], (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log(result);
  })
}

module.exports = {
  query,
  getSchemas,
};
