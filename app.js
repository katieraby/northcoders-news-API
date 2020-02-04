const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");
const { customErrorHandler, pSQLErrorHandling } = require("./errors");
app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrorHandler);
app.use(pSQLErrorHandling);

module.exports = app;
