const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics")
        .insert(topicData)
        .returning("*");
      console.log(topicsInsertions);
      const usersInsertions = knex("users")
        .insert(userData)
        .returning("*");

      return Promise.all([topicsInsertions, usersInsertions])
        .then(([insertedTopics, insertedUsers]) => {
          console.log(insertedTopics, "topics log");
          console.log(insertedUsers, "users log");

          const formattedArticles = formatDates(articleData);
          console.log(formattedArticles, "articles log");
          /*  
          Your article data is currently in the incorrect format and will violate your SQL schema. 
          You will need to write and test the provided formatDate utility function to be able insert your article data.
          Your comment insertions will depend on information from the seeded articles, so make sure to return the data after it's been seeded.
          */
        })
        .then(articleRows => {
          /* 
    
          Your comment data is currently in the incorrect format and will violate your SQL schema. 
    
          Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
          
          You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
          */

          const articleRef = makeRefObj(articleRows);
          const formattedComments = formatComments(commentData, articleRef);
          return knex("comments").insert(formattedComments);
        });
    });
};
