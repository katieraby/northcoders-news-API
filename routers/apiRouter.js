const apiRouter = require("express").Router();
const topicsRouter = require("../routers/topicsRouter");

apiRouter.route("/");

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
