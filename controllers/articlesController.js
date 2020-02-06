const {
  fetchArticleById,
  updateArticleById,
  createCommentByArticleId
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
  const { article_id } = req.params;
  updateArticleById(req, article_id)
    .then(() => {
      return fetchArticleById(article_id);
    })
    .then(fetchedArticle => {
      res.status(200).send(fetchedArticle);
    })
    .catch(err => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  // if (
  //   Object.keys(req).length === 2 &&
  //   req.hasOwnProperty("username") &&
  //   req.hasOwnProperty("body")
  // )
  createCommentByArticleId(req, article_id)
    .then(returnedComment => {
      res.status(201).send({ comment: returnedComment });
    })
    .catch(err => {
      next(err);
    });
};
