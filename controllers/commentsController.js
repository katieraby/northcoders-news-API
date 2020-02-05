const {
  updateCommentById,
  removeCommentById
} = require("../models/commentsModel");

exports.patchCommentById = (req, res, next) => {
  console.log;
  const { comment_id } = req.params;
  updateCommentById(req, comment_id)
    .then(updatedComment => {
      res.status(200).send({ comment: updatedComment });
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
};
