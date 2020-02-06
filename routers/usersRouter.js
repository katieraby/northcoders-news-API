const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/usersController");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
