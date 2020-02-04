const knex = require("../db/connection");

exports.fetchUserByUsername = username => {
  return knex
    .select("*")
    .from("users")
    .where({ username })
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No user found for ${username}`
        });
      } else {
        return { user };
      }
    });
};
