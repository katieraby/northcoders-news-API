const articlesRouter = require("express").Router();
const { getArticleById } = require("../controllers/articlesController");

articlesRouter.route("/:article_id").get(getArticleById);

module.exports = articlesRouter;
