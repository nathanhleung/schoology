const Schoology = require('./Schoology');

const schoology = new Schoology({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  callback: process.env.CALLBACK,
});

function getAuthorizeURL() {
  return schoology.getAuthorizeData().then((result) => {
    return Promise.resolve({
      url: result.url,
      token: result.token,
    });
  });
}

function getAccessToken(oauth_token, token_secret) {
  return schoology.getAccessToken(oauth_token, token_secret);
}

function getMe(accessToken, accessSecret) {
  return schoology.getMe(accessToken, accessSecret);
}

function getGrades(id, accessToken, accessSecret) {
  return schoology.getGrades(id, accessToken, accessSecret);
}

function cleanGrades(grades) {
  const cleaned = grades;
  return cleaned;
}

module.exports = {
  getAuthorizeURL,
  getAccessToken,
  getMe,
  getGrades,
  cleanGrades,
};
