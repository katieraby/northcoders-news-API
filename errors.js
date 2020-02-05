const customErrorHandler = (err, req, res, next) => {
  if (err.status !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const pSQLErrorHandling = (err, req, res, next) => {
  if (err.code !== undefined) {
    const pSQLErrors = {
      "22P02": {
        status: 400,
        msg: "Invalid input -- must be an integer"
      }
    };
    res
      .status(pSQLErrors[err.code].status)
      .send({ msg: pSQLErrors[err.code].msg });
  } else next(err);
};

const genericErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};

module.exports = { customErrorHandler, pSQLErrorHandling, genericErrorHandler };
