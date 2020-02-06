const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");
const {
  customErrorHandler,
  pSQLErrorHandling,
  serverErrorHandler,
  send405Error
} = require("./errors");
app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrorHandler);
app.use(pSQLErrorHandling);
app.use(serverErrorHandler);
app.use(send405Error);

module.exports = app;
