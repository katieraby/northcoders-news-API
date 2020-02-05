const { updateCommentById } = require("../models/commentsModel");

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
