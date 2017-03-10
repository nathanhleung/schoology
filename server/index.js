require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const path = require('path');

const helpers = require('./helpers');

const app = express();

app.set('port', process.env.PORT);
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '..', 'client'), {
  maxAge: '1y',
}));

app.get('/get-url', (req, res) => {
  helpers.getAuthorizeURL()
    .then((url) => {
      res.json(url);
    }).catch((err) => {
      res.send(err);
    });
});

app.get('/callback', (req, res) => {
  console.log(req);
});

app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}!`);
});
