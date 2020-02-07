const knex = require("../db/connection");

exports.updateCommentById = (inc_votes = 0, comment_id) => {
  return knex("comments")
    .increment("votes", inc_votes)
    .where({ comment_id })
    .returning("*");
};

exports.removeCommentById = comment_id => {
  return knex("comments")
    .delete()
    .where({ comment_id })
    .then(rowCount => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment ID not found" });
      }
    });
};
