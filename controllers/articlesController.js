const {
  fetchArticleById,
  updateArticleById,
  createCommentByArticleId,
  fetchCommentsByArticleId,
  fetchAllArticles,
  fetchArticleCount,
  createArticle,
  removeArticleById
} = require("../models/articlesModel");

const { createTopic } = require("../models/topicsModel");

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

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  return Promise.all([
    fetchAllArticles(req.query),
    fetchArticleCount(req.query)
  ])
    .then(([articles, articlecount]) => {
      const articlesToReturn = articles.map(article => {
        article.body = truncateBody(article.body);
        return article;
      });
      res
        .status(200)
        .send({ articles: articlesToReturn, totalCount: +articlecount });
    })
    .catch(err => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const topicToPost = { slug: req.body.topic, description: "default" };
  createTopic(topicToPost)
    .then(postedTopic => {
      return createArticle(req.body);
    })
    .then(postedArticle => {
      res.status(201).send({ article: postedArticle[0] });
    })
    .catch(err => {
      next(err);
    });
};
