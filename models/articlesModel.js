const knex = require("../db/connection");

exports.fetchArticleById = article_id => {
  return knex
    .select("articles.*")
    .from("articles")
    .where({ "articles.article_id": article_id })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments" })
    .then(articleById => {
      if (articleById.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article ID ${article_id} does not exist`
        });
      } else {
        return { article: articleById[0] };
      }
    });
};

exports.updateArticleById = (inc_votes = 0, article_id) => {
  return knex("articles")
    .increment("votes", inc_votes)
    .where({ article_id })
    .returning("*")
    .then(result => {
      return result;
    });
};

exports.createCommentByArticleId = (req, article_id) => {
  return Promise.all([
    req,
    this.checkArticleExists(article_id),
    this.checkUsernameExists(req.body.username)
  ]).then(([req, articleExists, usernameExists]) => {
    if (!articleExists) {
      return Promise.reject({
        status: 404,
        msg: `Article ID ${article_id} does not exist`
      });
    }

    if (articleExists && usernameExists) {
      const { body } = req.body;
      const { username } = req.body;

      if (body === undefined || username === undefined) {
        return Promise.reject({
          status: 400,
          msg: "Bad request - incorrect input"
        });
      }

      return knex
        .insert({ author: username, body, article_id })
        .into("comments")
        .returning("*")
        .then(result => {
          return result;
        });
    }
  });
};

exports.fetchCommentsByArticleId = (article_id, query) => {
  if (
    ["comment_id", "votes", "created_at", "author", "body"].indexOf(
      query.sort_by
    ) === -1
  ) {
    query.sort_by = "created_at";
  }

  if (query.order !== "asc") query.order = "desc";
  return knex("comments")
    .select("*")
    .where({ article_id })
    .orderBy(query.sort_by, query.order)
    .then(returnedComments => {
      return Promise.all([
        returnedComments,
        this.checkArticleExists(article_id)
      ]);
    })
    .then(([returnedComments, articleExists]) => {
      if (articleExists) {
        if (returnedComments.length === 0) {
          return [];
        }

        const formattedComments = returnedComments.map(comment => {
          delete comment.article_id;
          return comment;
        });
        return { comments: formattedComments };
      } else {
        return Promise.reject({
          status: 400,
          msg: "Invalid article ID provided"
        });
      }
    });
};

exports.checkArticleExists = article_id => {
  return knex("articles")
    .select("*")
    .where({ article_id })
    .then(articleRows => {
      if (articleRows.length === 0) return false;
      else return true;
    });
};

exports.checkUsernameExists = username => {
  return knex("users")
    .select("*")
    .where({ username })
    .then(userRows => {
      if (userRows.length === 0) return false;
      else return true;
    });
};

exports.fetchAllArticles = query => {
  if (!query.sort_by) query.sort_by = "created_at";
  if (!query.order) query.order = "desc";
  return knex
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments" })
    .orderBy(query.sort_by, query.order)
    .then(allArticles => {
      const formattedArticles = allArticles.map(article => {
        delete article.body;
        return article;
      });
      return formattedArticles;
    });
};
