const knex = require("../db/connection");

exports.updateCommentById = (req, comment_id) => {
  if (
    req.body.hasOwnProperty("inc_votes") &&
    typeof req.body.inc_votes === "number"
  ) {
    const { inc_votes: votes } = req.body;
    if (Math.sign(votes) === 0 || Math.sign(votes) === 1) {
      return knex("comments")
        .increment("votes", votes)
        .where({ comment_id })
        .returning("*");
    } else {
      let positiveVotes = Math.abs(votes);
      return knex("comments")
        .decrement("votes", positiveVotes)
        .where({ comment_id })
        .returning("*");
    }
  } else {
    return Promise.reject({
      status: 400,
      msg: "Bad request - incorrect input for update"
    });
  }
};
