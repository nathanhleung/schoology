const Schoology = require('./Schoology');

function getAuthorizeURL() {
  const schoology = new Schoology({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    callback: process.env.CALLBACK,
  });
  return schoology.getAuthorizeURL();
}

module.exports = {
  getAuthorizeURL,
};
