const apiRouter = require("express").Router();
const topicsRouter = require("../routers/topicsRouter");
const usersRouter = require("../routers/usersRouter");

apiRouter.route("/");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
