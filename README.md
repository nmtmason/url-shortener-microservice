# [URL Shortener Microservice](https://www.freecodecamp.com/challenges/url-shortener-microservice)

Part of the [freecodecamp](https://www.freecodecamp.com) curriculum.

## Objective

Build a full stack JavaScript app that is functionally similar to this: https://little-url.herokuapp.com/ and deploy it to Heroku.

1. User Story: I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
2. User Story: If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
3. User Story: When I visit that shortened URL, it will redirect me to my original link.

## Solution

* Implemented using the [express](http://expressjs.com/) and [pg](https://github.com/brianc/node-postgres) libraries.
* A table `urls` is created to hold the URLs inside a PostgreSQL database.
* Each row holds a URL and unique id (the primary key).
* When a URL is requested to be created (using `/new/:url`), a lookup first occurs against the database to see if the URL already exists.
* When a match is found, the already existing id will be sent back, otherwise a new row is created.
* When a shortened URL is requested (using `/:id`), the user will be redirected to the corresponding URL.
* Promises are used in the application and wrap calls to the database.
