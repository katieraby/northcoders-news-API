const knex = require("../db/connection");

exports.fetchAllTopics = () => {
  return knex
    .select("*")
    .from("topics")
    .then(allTopics => {
      return { topics: allTopics };
    });
};
