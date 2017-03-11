const db = require('./db.js');

function dropUserTable(cb) {
  db.query(`DROP TABLE users;`, [], cb);
}

function createUserTable(cb) {
  db.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password text NOT NULL,
    schoology_id integer,
    schoology_oauth_token text,
    schoology_oauth_token_secret text,
    schoology_access_token_key text,
    schoology_access_token_secret text
  );`, [], cb);
}

/**
 * @todo make a user schema since this depends on arg passed
 * also the preprocessing before calling the cb is dangerous
 * what if result.rows is undefined?
 * it only happens when result is undefined though (the error)
 */
function createUser(options, cb) {
  db.query(`
    INSERT into users(
      ${Object.keys(options).join(',')}
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `, [
    options.username,
    options.password,
    options.schoology_oauth_token,
    options.schoology_oauth_token_secret,
    options.schoology_access_token_key,
    options.schoology_access_token_secret,
  ], (err, result) => {
    cb(err, result.rows[0]);
  });
}

function updateUser(id, options) {
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

function showUsers(cb) {
  db.query('SELECT * FROM users;', [], (err, result) => {
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
  dropUserTable,
  createUserTable,
  createUser,
  showUsers,
  getUserById,
  updateUser,
};
