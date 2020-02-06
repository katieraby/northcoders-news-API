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

const serverErrorHandler = (err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ msg: "Internal server error" });
  } else {
    next(err);
  }
};

const send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

module.exports = {
  customErrorHandler,
  pSQLErrorHandling,
  serverErrorHandler,
  send405Error
};
