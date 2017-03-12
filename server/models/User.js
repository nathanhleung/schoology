const Model = require('./Model');

/**
 * User model
 */
class User extends Model {}

User.schema = {
  username: 'text NOT NULL UNIQUE',
  password: 'text NOT NULL',
  schoology_id: 'integer',
  schoology_oauth_token: 'text',
  schoology_oauth_token_secret: 'text',
  schoology_access_token_key: 'text',
  schoology_access_token_secret: 'text',
};

module.exports = User;
