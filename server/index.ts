require('dotenv').config();

import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';

import * as setup from './db/helpers';
import * as helpers from './helpers';

const app = express();

app.set('port', process.env.PORT);
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '..', 'client'), {
  maxAge: '1y',
}));

app.get('/get-url', (req, res) => {
  let token: String;
  let authorizeUrl: String;
  helpers.getAuthorizeURL()
    .then((result) => {
      token = result.token;
      authorizeUrl = result.url;
      return setup.getUserById(1);
    })
    .then((user) => {
      delete user.id;
      user.schoology_oauth_token = token.oauth_token;
      user.schoology_oauth_token_secret = token.oauth_token_secret;
      return setup.updateUser(1, user);
    })
    .then((updatedUser) => {
      res.json(authorizeUrl);
    })
    .catch((err) => {
      console.log(err);
      res.send('An error occurred.');
    });
});

app.get('/callback', (req, res) => {
  let user;
  setup.getUserById(1)
    .then((u) => {
      user = u;
      if (user.schoology_oauth_token !== req.query.oauth_token) {
        // someone's in the middle!
        throw new Error('OAuth tokens do not match');
      }
      return helpers.getAccessToken(req.query.oauth_token, user.schoology_oauth_token_secret);
    })
    .then((token) => {
      delete user.id;
      user.schoology_access_token_key = token.oauth_token;
      user.schoology_access_token_secret = token.oauth_token_secret;
      return setup.updateUser(1, user);
    }).then((updatedUser) => {
      res.send(`
        <script>
          window.close();
        </script>
      `);
    })
    .catch((err) => {
      console.log(err);
      res.send('An error occurred.');
    });
});

app.get('/grades', (req, res) => {
  let user;
  setup.getUserById(1)
    .then((u) => {
      user = u;
      return helpers.getMe(user.schoology_access_token_key, user.schoology_access_token_secret);
    })
    .then((result) => {
      const json = JSON.parse(result);
      const id = json.id;
      return helpers.getGrades(id, user.schoology_access_token_key, user.schoology_access_token_secret);
    })
    .then((result) => {
      res.json(helpers.cleanGrades(JSON.parse(result)));
    })
    .catch((err) => {
      console.log(err);
      res.send('An error occurred.');
    });
});

app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}!`);
});
