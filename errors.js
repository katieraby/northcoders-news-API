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
      23505: {
        status: 400,
        msg: "duplicate key value violates unique constraint"
      }
    };
    res
      .status(pSQLErrors[err.code].status)
      .send({ msg: pSQLErrors[err.code].msg });
  } else next(err);
};

module.exports = { customErrorHandler, pSQLErrorHandling };
