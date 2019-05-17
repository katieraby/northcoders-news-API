# Hosting a PSQL DB using Heroku

There are many ways to host applications like the one you have created. One of these solutions is Heroku. Heroku provides a service that you can push your code to and it will build, run and host it. Heroku also allows for easy database integration. Their [documentation](https://devcenter.heroku.com/articles/getting-started-with-nodejs) is excellent, so take a look at that. This document is essentially a more condensed, specific version of the steps described in the Heroku docs.

## 1. Install the Heroku CLI

On macOS:

```bash
brew tap heroku/brew && brew install heroku
```

...or Ubuntu:

```bash
sudo snap install --classic heroku
```

## 2. Create a Heroku App

Log into Heroku using their command line interface:

```bash
heroku login
```

Create an app in an active git directory. Doing this in the folder where your server exists is a good start, as this is what you will be hosting.

```bash
heroku create your-app-name
```

Here `your-app-name` should be the name you want to give your application. If you don't specify an app name, you'll get a random one which can sometimes be a bit iffy.

This command will both create an app on Heroku for your account. It will also add a new `remote` to your git repository.
Check this by looking at your git remotes:

```bash
git remote -v
```

## 3. Push Your code up to Heroku

```bash
git push heroku master
```

## 4. Creating a Hosted Database

Go to the heroku site and log in.

- Select your application
- `Configure Add-ons`
- Choose `Heroku Postgres`

The free tier will be adequate for our purposes. This will provide you with a `postgreSQL` pre-created database!

Check that the database exists. Click `settings` on it, and view the credentials. Keep an eye on the URI. Don't close this yet!

## 5. Seeding the Production Database

Check that your database's url is added to the environment variables on Heroku:

```bash
heroku config:get DATABASE_URL
```

If you are in your app's directory, and the database is correctly linked as an add on to Heroku, it should display a DB URI string that is exactly the same as the one in your credentials.

At the top of your `knexfile.js`, add the following line of code:

```js
const { DB_URL } = process.env;
```

Then add a `production` key to the `customConfigs` object:

```js
const { DB_URL } = process.env;
// ...
const customConfigs = {
  // ...
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
};
// ...
```

It is critical to add the query of `ssl=true`, otherwise this will not work!

In your `./db/data/index.js` add a key of production with a value of your development data in your data object. Something like:

```js
const data = { test, development, production: development };
```

This is will ensure your production DB will get seeded with the development data.

In your `package.json`, add the following keys to the scripts:

```json
{
  "scripts": {
    "seed:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex seed:run",
    "migrate-latest:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:latest",
    "migrate-rollback:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:rollback"
  }
}
```

Each of these will establish an environment variable called `DB_URL`, and set it to whatever heroku provides as your DB URL. It is essential that you do this as the DB URL may change! This deals with a lack of predictability on heroku's end.

Make sure to **run the seed prod script** from your `package.json`:

```bash
npm run seed:prod
```

## 6. Connect To The Hosted Database when on Heroku

Change your connection file to look something like this:

```js
const ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');

const dbConfig =
  ENV === 'production'
    ? { client: 'pg', connection: process.env.DATABASE_URL }
    : require('../knexfile');

module.exports = knex(dbConfig);
```

It should check whether you're in production, and if you are, it should connect to the production database. Otherwise it will connect to the (`.gitignore`'d) knex file.

## 7. Use Heroku's PORT

In `listen.js`, make sure you take the PORT off the environment object if it's provided, like so:

```js
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
```

## 8. Add a start script

Make sure your package.json has this as a start script:

```json
"start": "node listen.js",
```

Commit your changes, and push to heroku master.

```bash
git push heroku master
```

## 9. Review Your App

```bash
heroku open
```

Any issues should be debugged with:

```bash
heroku logs --tail
```
