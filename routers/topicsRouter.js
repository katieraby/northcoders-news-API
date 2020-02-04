const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topicsController");

topicsRouter.route("/").get(getAllTopics);

module.exports = topicsRouter;
