const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topicsController");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(send405Error);

module.exports = topicsRouter;
