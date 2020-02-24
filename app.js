const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");
const cors = require("cors");
const {
  customErrorHandler,
  pSQLErrorHandling,
  serverErrorHandler,
  send405Error,
  noSuchRoute
} = require("./errors");
app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);
app.all("/*", noSuchRoute);

app.use(customErrorHandler);
app.use(pSQLErrorHandling);
app.use(serverErrorHandler);
app.use(send405Error);

module.exports = app;
