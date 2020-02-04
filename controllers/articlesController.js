const { fetchArticleById } = require("../models/articlesModel");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id).then(articlebyId => {
    res.status(200).send(articlebyId);
  });
};
