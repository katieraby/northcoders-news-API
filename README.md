# BE2-NC-Knews

## Northcoders News API

### Background

We will be building the API which to use in the Northcoders News Sprint during the Front End block of the course.

Our database will be PSQL, and you will interact with it using [Knex](https://knexjs.org).


### Step 1 - Seeding

Data has been provided for both testing and development environments so you will need to write a seed function to seed your database. You should think about how you will write your seed file to use either test data or dev data depending on the environment that you're running in. 

1. You should have separate tables for topics, articles, users and comments, and you will need to think carefully about the order in which you seed your data. 

TODO: topic slugs should be unique, so they act as the primary keys in this table.  If you wish to do a join with the topics table it should be done with the topic field.


* Each topic should have:
    - `slug` field which is a unique string that acts as the table's primary key
    - `description` field which is a string giving a brief description of a given topic

* Each user should have:
    - `user_id` which is a primary key for the topics table
    - `username` 
    - `avatar_url` 
    - `name` 

* Each article should have:
    - `article_id` which is the primary key
    - `title`
    - `body` 
    - `votes` defaults to 0
    - `topic` field which references the slug in the topics table
    - `user_id` field that references a user's primary key.
    - `created_at` defaults to the current date


* Each comment should have:
    - `comment_id` which is the primary key
    - `user_id` field that references a user's primary key
    - `article_id` field that references an article's primary key
    - `votes` defaults to 0
    - `created_at` defaults to the current date
    - `body`

- NOTE:  psql expects Date types to be in a date format - not a timestamp! However, you can easily turn a timestamp into a date using js...


### Step 2 - Building and Testing

1.  Build your Express app
2.  Mount an API Router onto your app
3.  Define the routes described below
4.  Define controller functions for each of your routes. 
5.  Use proper project configuration from the offset, being sure to treat development and test differently.
6.  Test each route **as you go**, checking both successful requests and the variety of errors you could expect to encounter.


**HINT** You will need to take advantage of knex migrations in order to efficiently test your application.

### Routes 

// TODO: Add the queries we would like to put in for additional complexity

Your server should have the following end-points:


```http
GET /api/topics
```
- responds with an array of topic objects  - each object should have a `slug` and `description` property.


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
    - `comment_count` which is the accumulated count of all the comments with this article_id.  You should make use of knex queries in order to achieve this.
    - `created_at` 
    - `topic`


Queries
* This route should accept the following queries:
 - limit, which limits the number of responses (defaults to 10)
 - sort_by, which sorts the articles by any valid column (defaults to date)
 - p, stands for page which specifies the page at which to start (calculated using limit)
 - sort_ascending, when "true" returns the results sorted in ascending order (defaults to descending)    


```http
POST /api/topics/:topic/articles
```

- accepts an object containing a `title` , `body` and a `user_id` property
- responds with the posted article


```http
GET /api/articles
```
- responds with an array of article objects
- each article should have: 
    - `author` which is the `username` from the users table,
    - `title`
    - `article_id`
    - `votes`
    - `comment_count` which is the accumulated count of all the comments with this article_id.  You should make use of knex queries in order to achieve this.
    - `created_at` 
    - `topic`


Queries
* This route should accept the following queries:
 - limit, which limits the number of responses (defaults to 10)
 - sort_by, which sorts the articles by any valid column (defaults to date)
 - p, stands for page which specifies the page at which to start (calculated using limit)
 - sort_ascending, when "true" returns the results sorted in ascending order (defaults to descending)


```http
GET /api/articles/:article_id
```
- responds with an article object 
- each article should have: 
    - `article_id`
    - `author` which is the `username` from the users table,
    - `title`
    - `votes`
    - `comment_count` which is the accumulated count of all the comments with this article_id.  You should make use of knex queries in order to achieve this.
    - `created_at` 
    - `topic`


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
* This route should accept the following queries:
 - limit, which limits the number of responses (defaults to 10)
 - sort_by, which sorts the articles by any valid column (defaults to date)
 - p, stands for page which specifies the page at which to start (calculated using limit)
 - sort_ascending, when "true" returns the results sorted in ascending order (defaults to descending)  


```http
POST /api/articles/:article_id/comments
```
- accepts an object with `article_id`,`user_id` and `body`
- responds with the posted comment


```http
PATCH /api/articles/:article_id
```


```http
PATCH /api/comments/:comment_id
```


```http
DELETE /api/comments/:comment_id
```

- should delete the given comment by `comment_id`
- should respond with an empty object


```http
DELETE /api/articles/:article_id
```

- should delete the given article by `article_id`
- should respond with an empty object



```http
GET /api/users/:username
```
# e.g: `/api/users/mitch123`
# Returns a JSON object with the profile data for the specified user.


```http
GET /api 
```
# Serves an HTML page with documentation for all the available endpoints



NOTE: When it comes to building your front end you'll find it extremely useful if your POST comment endpoint returns the new comment with the created_by property populated with the corresponding user object.

### Step 3 - Authentication

// TODO: Add Auth stuff (including testing)

### Step 4 - Hosting

// TODO: Add heroku hosting for DB and app.




### Step 4 - Preparing for your review and portfolio

Finally, you should write a README for this project (and remove this one). The README should be broken down like this: https://gist.github.com/PurpleBooth/109311bb0361f32d87a2

It should also include the link where your herokuapp is hosted.
