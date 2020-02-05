const {
  fetchArticleById,
  updateArticleById
} = require("../models/articlesModel");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(articlebyId => {
      res.status(200).send(articlebyId);
    })
    .catch(err => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticleById(inc_votes, article_id)
    .then(() => {
      return fetchArticleById(article_id);
    })
    .then(fetchedArticle => {
      res.status(200).send(fetchedArticle);
    });
};
