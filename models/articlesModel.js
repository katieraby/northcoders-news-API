const knex = require("../db/connection");

exports.fetchArticleById = article_id => {
  const fetchedArticle = knex
    .select("*")
    .from("articles")
    .where({ article_id });

  const fetchedComments = knex
    .select("*")
    .from("comments")
    .where({ article_id });

  return Promise.all([fetchedArticle, fetchedComments]).then(
    ([fetchedArticle, fetchedComments]) => {
      if (fetchedArticle.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article ID ${article_id} does not exist`
        });
      } else {
        fetchedArticle[0].comment_count = fetchedComments.length;
        return { article: fetchedArticle };
      }
    }
  );
};
//check if votes num is positive or negative then use the increment or decrement knex query
exports.updateArticleById = (votes, article_id) => {
  if (Math.sign(votes) === 0 || Math.sign(votes) === 1) {
    return knex("articles")
      .increment("votes", votes)
      .where({ article_id })
      .returning("*");
  } else {
    let positiveVotes = Math.abs(votes);
    return knex("articles")
      .decrement("votes", positiveVotes)
      .where({ article_id })
      .returning("*");
  }
  //update the votes first then call fetch article by the same id
};
