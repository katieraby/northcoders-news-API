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
        return { article: fetchedArticle[0] };
      }
    }
  );
};

exports.updateArticleById = (req, article_id) => {
  if (
    req.body.hasOwnProperty("inc_votes") &&
    typeof req.body.inc_votes === "number"
  ) {
    const { inc_votes: votes } = req.body;
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
  } else {
    return Promise.reject({
      status: 400,
      msg: "Bad request - incorrect input for update"
    });
  }
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

    if (!usernameExists) {
      return Promise.reject({ status: 404, msg: "Username not found" });
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

//works OK need comment count
exports.fetchAllArticles = () => {
  return knex("articles")
    .select("*")
    .then(articles => {});
};
