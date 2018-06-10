require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const url = require('url');
const dns = require('dns');
const lookup = util.promisify(dns.lookup);

const { Client } = require('./client');
const client = new Client(process.env.DATABASE_URL);

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(error => {
    next(error);
  });
};

//eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  res
    .status(500)
    .send({ error: error.message })
    .end();
};

class URLParseError extends Error {}
class DNSLookupError extends Error {}
class URLMissingError extends Error {}

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post(
  '/api/shorturl/new',
  asyncMiddleware(async (req, res) => {
    let parsed = url.parse(req.body.url);
    if (!parsed.host) {
      throw new URLParseError('invalid URL');
    }

    try {
      await lookup(parsed.host);
    } catch (error) {
      throw new DNSLookupError('invalid URL');
    }

    let result = await client.first('SELECT id, url FROM urls WHERE url = $1', [
      req.body.url
    ]);
    if (!result) {
      result = await client.first(
        'INSERT INTO urls (url) VALUES ($1) RETURNING id, url',
        [req.body.url]
      );
    }
    res.send({ original_url: result.url, short_url: result.id }).end();
  })
);

app.get(
  '/api/shorturl/:id',
  asyncMiddleware(async (req, res) => {
    let result = await client.first('SELECT id, url FROM urls WHERE id = $1', [
      req.params.id
    ]);
    if (!result) {
      throw new URLMissingError('invalid URL');
    }
    res.redirect(result.url);
  })
);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  client.connect();
});
