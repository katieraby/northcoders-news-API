const topicsRouter = require("express").Router();
const {
  getAllTopics,
  postNewTopic
} = require("../controllers/topicsController");
const { send405Error } = require("../errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .post(postNewTopic)
  .all(send405Error);

module.exports = topicsRouter;
