var express = require('express');
var pg = require('pg');

var db = {
  client: undefined,
  connect: function (str) {
    if (!this.client) {
      this.client = new pg.Client(str);
    }
    function promisify (resolve, reject) {
      this.client.connect(function (error) {
        if (error) {
          reject(error);
        }
        resolve();
      });
    }
    return new Promise(promisify.bind(this));
  },
  query: function (str, params = []) {
    function promisify (resolve, reject) {
      this.client.query(str, params, function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    }
    return new Promise(promisify.bind(this));
  }
};

var app = express();

app.get('/favicon.ico', function (request, response) {
  response.sendStatus(204);
});

app.get('/new/:url*', function (request, response, next) {
  var url = request.url.slice(5);
  db.query('SELECT id FROM urls WHERE url = $1', [url])
    .then(function (result) {
      if (result.rows.length === 0) {
        return db.query('INSERT INTO urls (url) VALUES ($1) RETURNING ID', [url]);
      }
      return result;
    })
    .catch(function (error) {
      next(error);
    })
    .then(function (result) {
      var id = result.rows[0].id;
      var target = request.protocol + '://' + request.get('host') + '/' + id;
      response.send({ source: url, target: target });
    })
    .catch(function (error) {
      next(error);
    });
});

app.get('/:id', function (request, response, next) {
  db.query('SELECT url FROM urls WHERE id = $1', [request.params.id])
    .then(function (result) {
      var url = result.rows[0].url;
      response.redirect(url);
    })
    .catch(function (error) {
      next(error);
    });
});

db.connect(process.env.DATABASE_URL)
  .then(function () {
    db.query('SELECT * FROM urls LIMIT 1')
      .catch(function () {
        db.query('CREATE TABLE urls (id BIGSERIAL PRIMARY KEY, url VARCHAR(255))');
      });
  })
  .catch(function (error) {
    throw new Error(error);
  });

app.listen(process.env.PORT);
