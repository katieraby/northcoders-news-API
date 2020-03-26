const knex = require("../db/connection");

const { checkTopicExists } = require("./articlesModel");

exports.fetchAllTopics = () => {
  return knex
    .select("*")
    .from("topics")
    .then(allTopics => {
      return { topics: allTopics };
    });
};

exports.createTopic = ({ slug, description }) => {
  return checkTopicExists(slug).then(doesTopicExist => {
    if (doesTopicExist === true) {
      return { topic: { slug, description } };
    } else {
      return knex
        .insert({ slug, description })
        .into("topics")
        .returning("*")
        .then(postedTopic => {
          return { topic: postedTopic[0] };
        });
    }
  });
};

// exports.createTopic = ({ slug, description }) => {
//   return checkTopicExists(slug)
//     ? { topic: { slug, description } }
//     : knex
//       .insert({ slug, description })
//       .into("topics")
//       .returning("*")
//       .then(postedTopic => {
//         return { topic: postedTopic[0] };
//       });
// };
