'use strict';

const request = require('request');
const qs = require('querystring');

const API_BASE = 'https://api.schoology.com/v1';

class Schoology {
  constructor({ callback, consumer_key, consumer_secret }) {
    this.oauth = {
      callback,
      consumer_key,
      consumer_secret,
    };
  }
  _getToken() {
    return new Promise((resolve, reject) => {
      request({
        url: `${API_BASE}/oauth/request_token`,
        oauth: this.oauth,
      }, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          const token = qs.parse(body);
          resolve(token);
        }
      });
    });
  }
  getAuthorizeURL() {
    return this._getToken().then((token) => {
      const query = {
        oauth_callback: this.oauth.callback,
        oauth_token: token.oauth_token,
      };
      return `${API_BASE}/oauth/authorize?` + qs.stringify(query);
    });
  }
}

module.exports = Schoology;
