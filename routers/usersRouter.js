const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/usersController");
const { send405Error } = require("../errors");

usersRouter.route("/").all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
