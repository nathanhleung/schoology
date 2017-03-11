class User {
  constructor(options) {
    this.username = options.username;
    this.password = options.password;
    this.schoology_oauth_token = options.schoology_oauth_token;
    this.schoology_oauth_token_secret = options.schoology_oauth_token_secret;
    this.schoology_access_token_key = options.schoology_access_token_key;
    this.schoology_access_token_secret = options.schoology_access_token_secret;
  }
}

module.exports = User;
