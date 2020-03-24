const usersRouter = require("express").Router();
const {
  getUserByUsername,
  postUser
} = require("../controllers/usersController");
const { send405Error } = require("../errors");

usersRouter
  .route("/")
  .post(postUser)
  .all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
