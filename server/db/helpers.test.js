const helpers = require('./helpers');
const User = require('../models/User');

describe('schemaToQuery', () => {
  it('should convert a Javascript Object schema to an SQL query', () => {
    /* eslint-disable no-regex-spaces */
    // Trims whitespace and removes all runs of multiple spaces
    const expected = `
      id SERIAL PRIMARY KEY,
      username text NOT NULL UNIQUE,
      password text NOT NULL,
      schoology_id integer,
      schoology_oauth_token text,
      schoology_oauth_token_secret text,
      schoology_access_token_key text,
      schoology_access_token_secret text
    `.trim().replace(/  +/g, '');
    /* eslint-enable no-regex-spaces */
    expect(helpers.schemaToQuery(User.schema)).toBe(expected);
  });
});
