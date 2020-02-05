const commentsRouter = require("express").Router();
const { patchCommentById } = require("../controllers/commentsController");

commentsRouter.route("/:comment_id").patch(patchCommentById);

module.exports = commentsRouter;
