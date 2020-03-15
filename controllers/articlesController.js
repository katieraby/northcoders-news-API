const {
  fetchArticleById,
  updateArticleById,
  createCommentByArticleId,
  fetchCommentsByArticleId,
  fetchAllArticles
} = require("../models/articlesModel");

const { truncateBody } = require("../db/utils/utils");

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
  const { inc_votes } = req.body;
  updateArticleById(inc_votes, article_id)
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
  createCommentByArticleId(req, article_id)
    .then(returnedComment => {
      res.status(201).send({ comment: returnedComment[0] });
    })
    .catch(err => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id, req.query)
    .then(fetchedComments => {
      res.status(200).send(fetchedComments);
    })
    .catch(err => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      const articlesToReturn = articles.map(article => {
        article.body = truncateBody(article.body);
        return article;
      });
      console.log(articlesToReturn);
      res.status(200).send({ articles: articlesToReturn });
    })
    .catch(err => {
      next(err);
    });
};
