# Northcoders News API &nbsp; :newspaper: :newspaper_roll:

Welcome to my Northcoders News API (Application Programming Interface), serving up a range of random Northcoders data on a number of available endpoints.

You can find the hosted version: \
link TBC

## Overview of available endpoints

```
GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
```

## Getting Started & Installation
  ### Prerequisites

  To run this API on your machine, you will need Node.js and Postgres installed on your machine.

  To install Postgres, go to: https://www.postgresql.org/download/ \
  The version required is a minimum of v. 12.1

  To install Node, go to: https://nodejs.org/en/download/ \
  The version required is a minimum of v. 13.8.0

  ### Installation
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. Clone a copy of the repository on your machine using the below command:

```javascript
git clone https://github.com/katieraby/northcoders-news-API.git
```

2. Install the required dependencies:

```javascript
npm install
```

  ### Getting Started
1. Setup the database by running the below script:
```javascript
npm run setup-dbs
```

  1a. To seed the database with an initial set of data:
  ```javascript
  npm run seed
  ```


## Running the tests

To run the tests written for the API during the TDD process (including tests for error handling), run the following command:
```javascript
npm run test
```

To run the tests written for the utils functions, run the following command:
```javascript
npm run test-utils
```

## Endpoints - Detailed View

Endpoint information here...

## Built With

- [Node](https://nodejs.org/en/) - JavaScript server-side runtime environment
- [Knex](https://knexjs.org) - An SQL query builder - used to interact with the PSQL database
- [PostgreSQL](https://www.postgresql.org/) - Open source object-relational database system
- [Express](https://expressjs.com/) - Node.js web application server framework

## Acknowledgments

- Thanks to the team at Northcoders for providing me with the skills to create this awesome API during our back-end block. 
