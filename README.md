# Northcoders News API

## Background

We will be building the API to use in the Northcoders News Sprint during the Front End block of the course.

Our database will be PSQL, and you will interact with it using [Knex](https://knexjs.org).

## Step 1 - Setting Up the Project

We can use a project generator from `npm` to create some boilerplate code for our application.

[Yo](https://www.npmjs.com/package/yo) is a framework for creating project generators, so we will need to install it, as well as the specific project generator we want to use: [Knexpress](https://www.npmjs.com/package/generator-knexpress).

```bash
npm i -g yo generator-knexpress
```

Once installed, we can run the generator with `yo` to create the project:

```bash
yo knexpress
```

After generating the project, familiarise yourself with the structure and scripts available. Then, copy the data from this repository over the appropriate place in your project.

## Step 2 - Seeding

Data has been provided for both testing and development environments so you will need to write a seed function to insert the appropriate data into your database. You should think about how you will write your seed file to use either test data or dev data depending on the environment that you're running in.

You should have separate tables for topics, articles, users and comments, and you will need to think carefully about the order in which you seed your data.

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
  - `author` field that references a user's primary key (username)
  - `created_at` defaults to the current date

- Each comment should have:

  - `comment_id` which is the primary key
  - `author` field that references a user's primary key (username)
  - `article_id` field that references an article's primary key
  - `votes` defaults to 0
  - `created_at` defaults to the current date
  - `body`

- **NOTE:** psql expects `Date` types to be in a date format - not a timestamp! However, you can easily **turn a timestamp into a date using JS**...

---

## Step 3 - Building Endpoints

- Use proper project configuration from the offset, being sure to treat development and test differently.
- Test each route **as you go**, checking both successful requests and the variety of errors you could expect to encounter.
- After taking the happy path when testing a route, think about how a client could make it go wrong. Add a test for that situation, then error handling to deal with it gracefully.
- **HINT**: You will need to take advantage of knex migrations in order to efficiently test your application.

---

### Vital Routes

Your server _must_ have the following endpoints:

```http
GET /api/topics

GET /api/articles

GET /api/articles/:article_id
PATCH /api/articles/:article_id

GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api/users/:username

GET /api
```

---

### Route Requirements

_**All of your endpoints should send the below responses in an object, with a key name of what it is that being sent. E.g.**_

```json
{
  "topics": [
    {
      "description": "Code is love, code is life",
      "slug": "coding"
    },
    {
      "description": "FOOTIE!",
      "slug": "football"
    },
    {
      "description": "Hey good looking, what you got cooking?",
      "slug": "cooking"
    }
  ]
}
```

---

```http
GET /api/topics
```

#### Responds with

- an array of topic objects, each of which should have the following properties:
  - `slug`
  - `description`

---

```http
GET /api/articles
```

#### Responds with

- an `articles` array of article objects, each of which should have the following properties:
  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this article_id - you should make use of knex queries in order to achieve this

#### Should accept queries

- `author`, which filters the articles by the username value specified in the query
- `topic`, which filters the articles by the topic value specified in the query
- `sort_by`, which sorts the articles by any valid column (defaults to date)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)

---

```http
GET /api/articles/:article_id
```

#### Responds with

- an article object, which should have the following properties:
  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `body`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this article_id - you should make use of knex queries in order to achieve this

---

```http
PATCH /api/articles/:article_id
```

#### Request body accepts

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current article's vote property by 1

  `{ inc_votes : -100 }` would decrement the current article's vote property by 100

#### Responds with

- the updated article

---

```http
GET /api/articles/:article_id/comments
```

#### Responds with

- an array of comments for the given `article_id` of which each comment should have the following properties:
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

#### Accepts queries

- `sort_by`, which sorts the articles by any valid column (defaults to created_at)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)

---

```http
POST /api/articles/:article_id/comments
```

#### Request body accepts

- an object with the following properties:
  - `username`
  - `body`

#### Responds with

- the posted comment

---

```http
PATCH /api/comments/:comment_id
```

#### Request body accepts

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current article's vote property by 1

  `{ inc_votes : -1 }` would decrement the current article's vote property by 1

#### Responds with

- the updated comment

---

```http
DELETE /api/comments/:comment_id
```

#### Should

- delete the given comment by `comment_id`

#### Responds with

- status 204 and no content

---

```http
GET /api/users/:username
```

#### Responds with

- a user object which should have the following properties:
  - `username`
  - `avatar_url`
  - `name`

# STOP!

If you have reached this point, let someone on the teaching team know. One of us will be able to take a look at your code and give you some feedback. While we are looking at your code, you can continue with the following:

# Continue...

---

```http
GET /api
```

#### Responds with

- JSON describing all the available endpoints on your API

---

### Step 3 - Hosting

Make sure your application and your database is hosted using Heroku

### Step 4 - README

Write a README for your project. Check out this [guide](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) for what sort of things should be included.

It should also include the link to where your Heroku app is hosted.

Take a look at GitHub's guide for [mastering markdown](https://guides.github.com/features/mastering-markdown/) for making it look pretty!

### Optional Extras

#### Pagination

To make sure that an API can handle large amounts of data, it is often necessary to use **pagination**. Head over to [Google](https://www.google.co.uk/search?q=cute+puppies), and you will notice that the search results are broken down into pages. It would not be feasible to serve up _all_ the results of a search in one go. The same is true of websites / apps like Facebook or Twitter (except they hide this by making requests for the next page in the background, when we scroll to the bottom of the browser). We can implement this functionality on our `/api/articles` and `/api/comments` endpoints.

```http
GET /api/articles
```

- Should accepts the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
- add a `total_count` property, displaying the total number of articles (**this should display the total number of articles with any filters applied, discounting the limit**)

---

```http
GET /api/articles/:article_id/comments
```

Should accept the following queries:

- `limit`, which limits the number of responses (defaults to 10)
- `p`, stands for page which specifies the page at which to start (calculated using limit)

#### More Routes

```http
POST /api/articles

DELETE /api/articles/:article_id

POST /api/topics

POST /api/users
GET /api/users
```
