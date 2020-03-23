const knex = require("../db/connection");

exports.fetchAllTopics = () => {
  return knex
    .select("*")
    .from("topics")
    .then(allTopics => {
      return { topics: allTopics };
    });
};

exports.createTopic = topic => {
  return knex.insert({ slug: topic, description: "default" }).into("topics");
};
