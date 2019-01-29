# BE2-NC-Knews

## Northcoders News API

### Background

We will be building the API to use in the Northcoders News Sprint during the Front End block of the course.

Our database will be PSQL, and you will interact with it using [Knex](https://knexjs.org).

### NOTE 1:

For this sprint ensure you have the eslint extension installed in VS-Code as it will help to enforce best practices when you are writing your code.

### NOTE 2:

Read this README.md carefully! :) 

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

- **NOTE:** psql expects Date types to be in a date format - not a timestamp! However, you can easily turn a timestamp into a date using js...

***

### Step 2 - Building and Testing

1.  Build your Express app
2.  Mount an API Router onto your app
3.  Define the routes described below
4.  Define controller functions for each of your routes.
5.  Use proper project configuration from the offset, being sure to treat development and test differently.
6.  Test each route **as you go**, checking both successful requests and the variety of errors you could expect to encounter.

**HINT** You will need to take advantage of knex migrations in order to efficiently test your application.

***

### Routes

Your server should have the following end-points:
```http
GET /api/topics
POST /api/topics

GET /api/topics/:topic/articles
POST /api/topics/:topic/articles

GET /api/articles

GET /api/articles/:article_id
PATCH /api/articles/:article_id
DELETE /api/articles/:article_id

GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments

PATCH /api/articles/:article_id/comments/:comment_id
DELETE /api/articles/:article_id/comments/:comment_id

GET /api/users
POST /api/users

GET /api/users/:username

GET /api
```

***

#### Route Requirements:

These have been split into **must haves** and some slightly more advanced _Nice to have / if time_

```http
GET /api/topics
```

**Responds with**
- an array of topic objects - each object should have a `slug` and `description` property.

***

```http
POST /api/topics
```

**Request body accepts**
- an object containing `slug` and `description` property, the `slug` must be unique

**Responds with**
- the posted topic object

***

```http
GET /api/topics/:topic/articles
```

**Responds with:**
- a `total_count` property, displaying the total number of articles
- an `articles` array of article objects for the given topic
- each article should have:
  - `author` which is the `username` from the users table,
  - `title`
  - `article_id`
  - `body`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this article_id. You should make use of knex queries in order to achieve this.


**If time:**
- This route should accept the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `sort_by`, which sorts the articles by any valid column (defaults to date)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
  - `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
  - `author`, which filters the articles by the username value specified in the query

***

```http
POST /api/topics/:topic/articles
```

- request body accepts an object containing a `title` , `body` and a `username` property
- responds with the posted article

***

```http
GET /api/articles
```

**Responds with:**
- an `articles` array of article objects
- each article should have:
  - `author` which is the `username` from the users table,
  - `title`
  - `article_id`
  - `body`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this article_id. You should make use of knex queries in order to achieve this.

**If time:**
- Add a `total_count` property, displaying the total number of articles
- This route should accept the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `sort_by`, which sorts the articles by any valid column (defaults to date)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
  - `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
  - `author`, which filters the articles by the username value specified in the query

***

```http
GET /api/articles/:article_id
```

**Responds with**
- an article object
- the article should have:
  - `author` which is the `username` from the users table,
  - `title`
  - `article_id`
  - `body`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this article_id. You should make use of knex queries in order to achieve this.

***

```http
PATCH /api/articles/:article_id
```

**Request body accepts**
- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by
    E.g `{ inc_votes : 1 }` would increment the current article's vote property by 1
    `{ inc_votes : -100 }` would decrement the current article's vote property by 100

**Responds with** 
- the article you have just updated

***

```http
DELETE /api/articles/:article_id
```
**Should**
- delete the given article by `article_id`

**Responds with**
- status 204 and no-content

***

```http
GET /api/articles/:article_id/comments
```

**Responds with**
- an array of comments for the given `article_id`
- each comment should have
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

**If time:**
- This route should accept the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `sort_by`, which sorts the articles by any valid column (defaults to date)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
  - `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)

***

```http
POST /api/articles/:article_id/comments
```

**Request body accepts**
- an object with a `username` and `body````

**Responds with**
- the posted comment

***

```http
PATCH /api/articles/:article_id/comments/:comment_id
```
**Request body accepts**
- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by
    E.g `{ inc_votes : 1 }` would increment the current article's vote property by 1
    `{ inc_votes : -1 }` would decrement the current article's vote property by 1

**Responds with**
- the updated comment

***

```http
DELETE /api/articles/:article_id/comments/:comment_id
```

**Should**
- delete the given comment by `comment_id`

**Responds with**
- status 204 and no-content

***

```http
GET /api/users
```

**Responds with**
- an array of user objects
- each user object should have
  - `username`
  - `avatar_url` 
  - `name` 
  
***

```http
POST /api/users
```

**Request body accepts**
- an object containing a `username` , `avatar_url` and a `name` property

**Responds with**
- the posted user

***

```http
GET /api/users/:username
```

**Responds with**
- a user object
- each user should have
  - `username`
  - `avatar_url`
  - `name`

***

```http
GET /api
```
**Responds with**
- JSON describing all the available endpoints on your API

***

### Step 3 - Hosting

Make sure your application and your database is hosted using heroku

### Step 4 - Preparing for your review and portfolio

Finally, you should write a README for this project (and remove this one). The README should be broken down like this: https://gist.github.com/PurpleBooth/109311bb0361f32d87a2

It should also include the link where your herokuapp is hosted.
