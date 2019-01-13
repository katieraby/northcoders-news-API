# BE2-NC-Knews

## Northcoders News API

### Background

We will be building the API to use in the Northcoders News Sprint during the Front End block of the course.

Our database will be PSQL, and you will interact with it using [Knex](https://knexjs.org).

### NOTE:

For this sprint ensure you have the eslint extension installed in VS-Code as it will help to enforce best practices when you are writing your code.

### Step 1 - Seeding

Data has been provided for both testing and development environments so you will need to write a seed function to seed your database. You should think about how you will write your seed file to use either test data or dev data depending on the environment that you're running in.


1. You should have separate tables for topics, articles, users and comments, and you will need to think carefully about the order in which you seed your data.

- Each topic should have:

  - `slug` field which is a unique string that acts as the table's primary key
  - `description` field which is a string giving a brief description of a given topic

- Each user should have:

  - `username` which is the primary key & unique
  - `avatar_url`
  - `name`

- Each article should have:
  - `article_id` which is the primary key
  - `title`
  - `body`
  - `votes` defaults to 0
  - `topic` field which references the slug in the topics table
  - `username` field that references a user's primary key.
  - `created_at` defaults to the current date

* Each comment should have:
  - `comment_id` which is the primary key
  - `username` field that references a user's primary key
  - `article_id` field that references an article's primary key
  - `votes` defaults to 0
  - `created_at` defaults to the current date
  - `body`

- NOTE: psql expects Date types to be in a date format - not a timestamp! However, you can easily turn a timestamp into a date using js...


### Step 2 - Building and Testing

1.  Build your Express app
2.  Mount an API Router onto your app
3.  Define the routes described below
4.  Define controller functions for each of your routes.
5.  Use proper project configuration from the offset, being sure to treat development and test differently.
6.  Test each route **as you go**, checking both successful requests and the variety of errors you could expect to encounter.

**HINT** You will need to take advantage of knex migrations in order to efficiently test your application.

### Routes

Your server should have the following end-points:

```http
GET /api/topics
```

- responds with an array of topic objects - each object should have a `slug` and `description` property.

```http
POST /api/topics
```

- accepts an object containing `slug` and `description` property, the `slug` must be unique
- responds with the posted topic object

```http
GET /api/topics/:topic/articles
```

- responds with an array of article objects for a given topic
- each article should have:
  - `author` which is the `username` from the users table,
  - `title`
  - `article_id`
  - `votes`
  - `comment_count` which is the accumulated count of all the comments with this article_id. You should make use of knex queries in order to achieve this.
  - `created_at`
  - `topic`

Queries

- This route should accept the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `sort_by`, which sorts the articles by any valid column (defaults to date)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
  - `order`, which can be set to `asc` or `desc` for ascending or descending  (defaults to descending)


## IMPORTANT:
* Both `comments` and `articles` data in the test-data are given ordered in descending order of time : this will be useful to you when it comes to writing your tests!


```http
POST /api/topics/:topic/articles
```

- accepts an object containing a `title` , `body` and a `username` property
- responds with the posted article

```http
GET /api/articles
```

- responds with an array of article objects
- each article should have:
  - `author` which is the `username` from the users table,
  - `title`
  - `article_id`
  - `body`
  - `votes`
  - `comment_count` which is the accumulated count of all the comments with this article_id. You should make use of knex queries in order to achieve this.
  - `created_at`
  - `topic`

Queries

- This route should accept the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `sort_by`, which sorts the articles by any valid column (defaults to date)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
  - `order`, which can be set to `asc` or `desc` for ascending or descending  (defaults to descending)


```http
GET /api/articles/:article_id
```

- responds with an article object
- each article should have:
  - `article_id`
  - `author` which is the `username` from the users table,
  - `title`
  - `votes`
  - `body`
  - `comment_count` which is the count of all the comments with this article_id. A particular SQL clause is useful for this job!
  - `created_at`
  - `topic`

```http
PATCH /api/articles/:article_id
```

- accepts an object in the form `{ inc_votes: newVote }`
  - `newVote` will indicate how much the `votes` property in the database should be updated by
    E.g `{ inc_votes : 1 }` would increment the current article's vote property by 1
    `{ inc_votes : -100 }` would decrement the current article's vote property by 100

- this end-point should respond with the article you have just updated    

```http
DELETE /api/articles/:article_id
```

- should delete the given article by `article_id`
- should respond with 204 and no-content

```http
GET /api/articles/:article_id/comments
```

- responds with an array of comments for the given `article_id`
- each comment should have
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

Queries

- This route should accept the following queries:

* limit, which limits the number of responses (defaults to 10)
* sort_by, which sorts the articles by any valid column (defaults to date)
* p, stands for page which specifies the page at which to start (calculated using limit)
* sort_ascending, when "true" returns the results sorted in ascending order (defaults to descending)

```http
POST /api/articles/:article_id/comments
```

- accepts an object with a `username` and `body`
- responds with the posted comment

```http
PATCH /api/articles/:article_id/comments/:comment_id
```

- accepts an object in the form `{ inc_votes: newVote }`
  - `newVote` will indicate how much the `votes` property in the database should be updated by
    E.g `{ inc_votes : 1 }` would increment the current article's vote property by 1
    `{ inc_votes : -1 }` would decrement the current article's vote property by 1

- this end-point should respond with the comment you have just updated

```http
DELETE /api/articles/:article_id/comments/:comment_id
```

- should delete the given comment by `comment_id`
- should respond with 204 and no-content

```http
GET /api/users
```

- should respond with an array of user objects
- each user object should have
  - `username`
  - `avatar_url`
  - `name`

```http
GET /api/users/:username
```

- should respond with a user object
- each user should have
  - `username`
  - `avatar_url`
  - `name`

```http
GET /api
```

- Serves JSON describing all the available endpoints on your API

### Step 3 - Hosting

Make sure your application and your database is hosted using heroku

### Step 4 - Preparing for your review and portfolio

Finally, you should write a README for this project (and remove this one). The README should be broken down like this: https://gist.github.com/PurpleBooth/109311bb0361f32d87a2

It should also include the link where your herokuapp is hosted.
