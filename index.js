require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const Schoology = require('./Schoology');

const app = express();

app.set('port', process.env.PORT);
app.use(logger('dev'));

const schoology = new Schoology({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  callback: process.env.CALLBACK,
});
schoology.getAuthorizeURL()
  .then((url) => {
    console.log(url);
  }).catch((err) => {
    console.log(err);
  });

app.get('/callback', (req, res) => {
  console.log(req);
});

app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}!`);
});
