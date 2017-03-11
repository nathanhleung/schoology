'use strict';

const request = require('request');
const qs = require('querystring');

const SCHOOLOGY_BASE = 'https://wsdweb.schoology.com';
const API_BASE = 'https://api.schoology.com/v1';

class Schoology {
  constructor({ callback, consumer_key, consumer_secret }) {
    this.callback = callback;
    this.oauth = {
      realm: 'Schoology API',
      consumer_key,
      consumer_secret,
    };
  }
  _getRequestToken() {
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
  _makeAuthorizeURL(token) {
    const query = {
      oauth_callback: this.callback,
      oauth_token: token.oauth_token,
    };
    return Promise.resolve(`${SCHOOLOGY_BASE}/oauth/authorize?${qs.stringify(query)}`);
  }
  getAuthorizeData() {
    let reqToken;
    return this._getRequestToken()
      .then((token) => {
        reqToken = token;
        return token;
      })
      .then(this._makeAuthorizeURL.bind(this))
      .then((url) => {
        return {
          token: reqToken,
          url,
        };
      });
  }
  getAccessToken(token, token_secret) {
    return new Promise((resolve, reject) => {
      request({
        url: `${API_BASE}/oauth/access_token`,
        oauth: Object.assign({}, this.oauth, {
          token,
          token_secret,
        }),
      }, (err, response, body) => {
        if (err) {
          return reject(err);
        }
        resolve(qs.parse(body));
      });
    });
  }
  getMe(accessToken, accessSecret) {
    return new Promise((resolve, reject) => {
      request({
        url: `${API_BASE}/users/me`,
        oauth: Object.assign({}, this.oauth, {
          token: accessToken,
          token_secret: accessSecret,
        }),
      }, (err, response, body) => {
        if (err) {
          return reject(err);
        }
        resolve(body);
      });
    });
  }
  getGrades(id, accessToken, accessSecret) {
    return new Promise((resolve, reject) => {
      request({
        url: `${API_BASE}/users/${id}/grades`,
        oauth: Object.assign({}, this.oauth, {
          token: accessToken,
          token_secret: accessSecret,
        }),
      }, (err, response, body) => {
        if (err) {
          return reject(err);
        }
        resolve(body);
      });
    });
  }
}

module.exports = Schoology;
