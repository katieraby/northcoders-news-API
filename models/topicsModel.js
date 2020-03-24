const knex = require("../db/connection");

exports.fetchAllTopics = () => {
  return knex
    .select("*")
    .from("topics")
    .then(allTopics => {
      return { topics: allTopics };
    });
};

exports.createTopic = ({ slug, description }) => {
  return knex
    .insert({ slug, description })
    .into("topics")
    .returning("*")
    .then(postedTopic => {
      return { topic: postedTopic[0] };
    });
};
