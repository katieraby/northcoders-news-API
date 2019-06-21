# Northcoders News API

**You can clone this repository but do not fork it**

## Background

We will be building the API to use in the Northcoders News Sprint during the Front End block of the course.

Your database will be PSQL, and you will interact with it using [Knex](https://knexjs.org).

## Step 1 - Setting up the Repository

Your first task is set up your own portfolio repository. Once you have cloned this repo, on github create your own **public** repo for your review. **Make sure NOT to initialise it with a README or .gitignore.**

Next, you should hook your cloned version to the newly created repo using the following terminal commands.

```console
cd <YOUR-CLONED-REPO>(be-nc-news)
```

```js
git remote -v

// This should display a url to the Northcoders repo
```

```js
git remote remove origin

// This will remove your cloned version from pushing to ours
```

```js
git remote -v

// This should now show nothing
```

```js
git remote add origin <YOUR- GITHUB-URL>

// This will add your github location to your local git repository
```

```js
git remote -v

// This should now show your repo url and you are good to go...
```

## Step 2 - Setting up your project

In this repo we have provided you with the knexfile. Make sure to add it to the `.gitignore` once you start pushing to your own repository. If you are on linux insert your postgres username and password into the knexfile.

You have also been provided with a `db` folder with some data, a [setup.sql](./db/setup.sql) file, a `seeds` folder and a `utils` folder. You should also take a minute to familiarise yourself with the npm scripts you have been provided.

Your second task is to make accessing both sets of data around your project easier. You should make 3 `index.js` files: one in `db`, and one in each of your data folders.

The job of `index.js` in each the data folders is to export out all the data from that folder, currently stored in separate files. This is so that, when you need access to the data elsewhere, you can write one convenient require statement - to the index file, rather than having to require each file individually. Make sure the index file exports an object with values of the data from that folder with the keys:

- `topicData`
- `articleData`
- `userData`
- `commentData`

The job of the `db/index.js` file will be to export out of the db folder _only the data relevant to the current environment_. Specifically this file should allow your seed file to access only a specific set of data depending on the environment it's in: test, development or production. To do this is will have to require in all the data and should make use of `process.env` in your `index.js` file to achieve only exporting the right data out.

**HINT: make sure the keys you export match up with the keys required into the seed file**

## Step 3 - Migrations and Seeding

Your seed file should now be set up to require in either test or dev data depending on the environment.

You will need to create your migrations and complete the provided seed function to insert the appropriate data into your database.

### Migrations

This is where you will set up the schema for each table in your database.

You should have separate tables for `topics`, `articles`, `users` and `comments`. You will need to think carefully about the order in which you create your migrations.

Each topic should have:

- `slug` field which is a unique string that acts as the table's primary key
- `description` field which is a string giving a brief description of a given topic

Each user should have:

- `username` which is the primary key & unique
- `avatar_url`
- `name`

Each article should have:

- `article_id` which is the primary key
- `title`
- `body`
- `votes` defaults to 0
- `topic` field which references the slug in the topics table
- `author` field that references a user's primary key (username)
- `created_at` defaults to the current timestamp

Each comment should have:

- `comment_id` which is the primary key
- `author` field that references a user's primary key (username)
- `article_id` field that references an article's primary key
- `votes` defaults to 0
- `created_at` defaults to the current timestamp
- `body`

- **NOTE:** psql expects `Timestamp` types to be in a specific date format - **not a unix timestamp** as they are in our data! However, you can easily **re-format a unix timestamp into something compatible with our database using JS - you will be doing this in your utility function**... [JavaScript Date object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

### Seeding

You need to complete the provided seed function to insert the appropriate data into your database.

Utilising your data manipulation skills, you will also need to complete the utility functions provided - `formatDate`, `makeRefObj`, and `formatComments` for the seed function to work. Instructions on these utility functions are in the [utils README](./db/utils/README.md).

**Some advice: don't write all the utility functions in one go, write them when you need them in your seed**

---

## Step 4 - Building Endpoints

- Use proper project configuration from the offset, being sure to treat development and test environments differently.
- Test each route **as you go**, checking both successful requests **and the variety of errors you could expect to encounter** [See the error-handling file here for ideas of errors that will need to be considered](error-handling.md).
- After taking the happy path when testing a route, think about how a client could make it go wrong. Add a test for that situation, then error handling to deal with it gracefully.
- **HINT**: You will need to take advantage of knex migrations in order to efficiently test your application.

---

### Vital Routes

Your server _must_ have the following endpoints:

```http
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
GET /api/users/:username
```

#### Responds with

- a user object which should have the following properties:
  - `username`
  - `avatar_url`
  - `name`

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

- `sort_by`, which sorts the articles by any valid column (defaults to date)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `author`, which filters the articles by the username value specified in the query
- `topic`, which filters the articles by the topic value specified in the query

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

# STOP!

If you have reached this point, go back and review all of the routes that you have created. Consider whether there are any errors that could occur that you haven't yet accounted for. If you identify any, write a test, and then handle the error. Even if you can't think of a specific error for a route, every controller that invokes a promise-based model should contain a `.catch` block to prevent unhandled promise rejections.

As soon as you think that you have handled all the possible errors that you can think of, let someone on the teaching team know. One of us will be able to take a look at your code and give you some feedback. While we are looking at your code, you can continue with the following:

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
