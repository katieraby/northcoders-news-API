const apiRouter = require("express").Router();
const topicsRouter = require("../routers/topicsRouter");
const usersRouter = require("../routers/usersRouter");
const articlesRouter = require("../routers/articlesRouter");
const commentsRouter = require("../routers/commentsRouter");

const { send405Error } = require("../errors");

apiRouter.route("/").all(send405Error);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
