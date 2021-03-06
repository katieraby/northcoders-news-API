const {
  updateCommentById,
  removeCommentById
} = require("../models/commentsModel");

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(inc_votes, comment_id)
    .then(updatedComment => {
      res.status(200).send({ comment: updatedComment[0] });
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204).send({ msg: "Comment successfully deleted" });
    })
    .catch(err => {
      next(err);
    });
};
