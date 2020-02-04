const knex = require("../db/connection");

//also want to query the comments table which has the article id on each comment to see how many come back then add that to the article object retrieved initially, so will need to promise all with the comments and articles retrieved to add the comment count to articles
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
