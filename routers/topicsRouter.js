const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topicsController");
const { send405Error } = require("../errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(send405Error);

module.exports = topicsRouter;
