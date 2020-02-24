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
  return Promise.all([req, this.checkArticleExists(article_id)]).then(
    ([req, articleExists]) => {
      if (!articleExists) {
        return Promise.reject({
          status: 404,
          msg: `Article ID ${article_id} does not exist`
        });
      }

      const { body } = req.body;
      const { username } = req.body;

      return knex
        .insert({ author: username, body, article_id })
        .into("comments")
        .returning("*")
        .then(result => {
          return result;
        });
    }
  );
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
          return { comments: [] };
        }

        const formattedComments = returnedComments.map(comment => {
          delete comment.article_id;
          return comment;
        });
        return { comments: formattedComments };
      } else {
        return Promise.reject({
          status: 404,
          msg: "Invalid article ID provided"
        });
      }
    });
};

exports.fetchAllArticles = query => {
  if (!query.sort_by) query.sort_by = "created_at";
  if (!query.order) query.order = "desc";

  return knex
    .select("articles.*")
    .from("articles")
    .modify(queryRequest => {
      if (query.author) {
        queryRequest.where("articles.author", query.author);
      }

      if (query.topic) {
        queryRequest.where("articles.topic", query.topic);
      }
    })

    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments" })
    .orderBy(query.sort_by, query.order)
    .then(allArticles => {
      const doesAuthorExist = query.author
        ? this.checkAuthorExists(query.author)
        : null;

      const doesTopicExist = query.topic
        ? this.checkTopicExists(query.topic)
        : null;

      return Promise.all([allArticles, doesAuthorExist, doesTopicExist]);
    })
    .then(([allArticles, doesAuthorExist, doesTopicExist]) => {
      if (doesAuthorExist === false) {
        return Promise.reject({ status: 404, msg: "Author does not exist" });
      }

      if (doesTopicExist === false) {
        return Promise.reject({ status: 404, msg: "Topic does not exist" });
      }

      return allArticles;
    });
};

//helper functions to check if exists within the database
exports.checkTopicExists = topic => {
  return knex("topics")
    .select("*")
    .where({ "topics.slug": topic })
    .then(topicRows => {
      if (topicRows.length === 0) return false;
      else return true;
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

exports.checkAuthorExists = author => {
  return knex("users")
    .select("*")
    .where({ "users.username": author })
    .then(authorRows => {
      if (authorRows.length === 0) return false;
      else return true;
    });
};
