const db = require('./db.js');

/**
 * Converts a schema object to an SQL query
 * @param schema {Model} - the schema to convert
 * @return query - the schema turned into a query object for table creation
 */
function schemaToQuery(schema) {
  const keys = Object.keys(schema);
  // Don't add a comma after the last key
  const noComma = keys.length - 1;
  // Make query from schema
  const query = keys.reduce((accumulator, key, i) => {
    let next = '';
    // Construct query in the form of id SERIAL PRIMARY KEY, etc.
    next += `${key} ${schema[key]}`;
    // If we're not on the last key, add a comma
    if (i !== noComma) {
      next += ',\n';
    }
    return accumulator + next;
  }, '');
  return query;
}

/**
 * Creates a table
 * @param name {string} - the name of the table
 * @param schema {object} - the schema object for the table
 */
function createTable(name, schema, cb) {
  db.query(`CREATE TABLE IF NOT EXISTS $1 (
    $2
  );`, [name, schemaToQuery(schema)], cb);
}

/**
 * Drops a table
 * @param name {string} - the name of the table to drop
 */
function dropTable(name, cb) {
  db.query('DROP TABLE $1;', [name], cb);
}

/**
 * Makes a range of variables for variable interpolation
 * @param max - the maxfor the range (starts at 1)
 * @return range - the range of variables (i.e. $1 $2 $3)
 */
function makeVariablesRange(max) {
  let range = '';
  for (let i = 1; i <= max; i += 1) {
    /* eslint-disable prefer-template */
    range += '$' + i;
    /* eslint-enable prefer-template */
  }
  return range;
}

/**
 * Creates a user
 * @param user {User} - the user object to insert into the database
 */
function createUser(user, cb) {
  // Order of keys isn't guaranteed, so establish
  // order here
  const keys = Object.keys(user);
  const values = keys.map(key => user[key]);
  db.query(`
    INSERT into users(
      ${keys.join(',')}
    )
    VALUES (${makeVariablesRange(schema.length)})
    RETURNING *;
  `, values, (err, result) => {
    cb(err, result.rows[0]);
  });
}

function updateUser(id, user) {
  return new Promise((resolve, reject) => {
    db.query(`
      UPDATE users SET (
        ${Object.keys(user).join(',')}
      ) = ($1, $2, $3, $4, $5, $6)
      WHERE id = $7
      RETURNING *;
    `, [
      user.username,
      user.password,
      user.schoology_oauth_token,
      user.schoology_oauth_token_secret,
      user.schoology_access_token_key,
      user.schoology_access_token_secret,
      id,
    ], (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result.rows[0]);
    });
  });
}

function showRows(table, cb) {
  db.query('SELECT * FROM $1;', [table], (err, result) => {
    cb(err, result.rows);
  });
}

function getUserById(id, cb) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
      if (err) {
        return reject(err);
      }
      const user = Object.assign({}, result.rows[0]);
      return resolve(user);
    });
  });
}

module.exports = {
  dropTable,
  createTable,
  createUser,
  showRows,
  getUserById,
  updateUser,
  schemaToQuery,
};
