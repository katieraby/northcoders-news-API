const usersRouter = require("express").Router();
const {
  getUserByUsername,
  postUser,
  getAllUsers
} = require("../controllers/usersController");
const { send405Error } = require("../errors");

usersRouter
  .route("/")
  .post(postUser)
  .get(getAllUsers)
  .all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
