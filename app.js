const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");
const { customErrorHandler, pSQLErrorHandling } = require("./errors");
app.use(express.json());

app.use(customErrorHandler);
app.use(pSQLErrorHandling);
app.use("/api", apiRouter);

module.exports = app;
