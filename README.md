# [URL Shortener Microservice](https://learn.freecodecamp.org/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice)

Part of the [freecodecamp](https://www.freecodecamp.com) curriculum.

## Objective

Build a full stack JavaScript app that is functionally similar to this: https://thread-paper.glitch.me/

## Solution

- Implemented using the [express](http://expressjs.com/) and [pg](https://github.com/brianc/node-postgres) libraries.
- A table `urls` is created to hold the URLs inside a PostgreSQL database.
- Each row holds a URL and unique id (the primary key).
- When a URL is requested to be created (using `/api/shorturl/new`), a lookup first occurs against the database to see if the URL already exists.
- When a match is found, the already existing id will be sent back, otherwise a new row is created.
- When a shortened URL is requested (using `/api/shorturl/:id`), the user will be redirected to the corresponding URL.
