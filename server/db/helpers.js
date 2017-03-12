const db = require('./db.js');

/**
 * Converts a schema object to an SQL query
 * @param schema {object} - the schema to convert
 */
function schemaToQuery(schema) {
  const keys = Object.keys(schema);
  const noComma = keys.length - 1;
  // Prepend id field
  let finalQuery = 'id SERIAL PRIMARY KEY,\n';
  // Make query from schema
  finalQuery += keys.reduce((query, key, i) => {
    let next = '';
    // Construct query in the form of id SERIAL PRIMARY KEY, etc.
    next += `${key} ${schema[key]}`;
    // If we're not on the last key, add a comma
    if (i !== noComma) {
      next += ',\n';
    }
    return query + next;
  }, '');
  return finalQuery;
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

function makeVariablesRange(max) {
  let range = '';
  for (let i = 1; i <= max; i += 1) {
    /* eslint-disable prefer-template */
    range += '$' + i;
    /* eslint-enable prefer-template */
  }
  return range;
}

function createUser(user, cb) {
  const schema = user.constructor.schema;
  // Order of keys isn't guaranteed, so establish
  // order here
  const keys = Object.keys(schema);
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
        ${Object.keys(options).join(',')}
      ) = ($1, $2, $3, $4, $5, $6)
      WHERE id = $7
      RETURNING *;
    `, [
      options.username,
      options.password,
      options.schoology_oauth_token,
      options.schoology_oauth_token_secret,
      options.schoology_access_token_key,
      options.schoology_access_token_secret,
      id,
    ], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result.rows[0]);
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
      resolve(user);
    });
  });
}

module.exports = {
  dropTable,
  createTable,
  createUser,
  showUsers,
  getUserById,
  updateUser,
  schemaToQuery,
};
