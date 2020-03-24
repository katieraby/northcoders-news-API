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
        return { user: user[0] };
      }
    });
};

exports.addNewUser = ({ username, avatar_url, name }) => {
  return knex
    .insert({
      username,
      avatar_url: avatar_url || "http://avatarurlhere.com/avatar.jpg",
      name: name || "Name Of The User"
    })
    .into("users")
    .returning("*")
    .then(postedUser => {
      return { user: postedUser[0] };
    });
};
