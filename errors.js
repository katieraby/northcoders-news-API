const customErrorHandler = (err, req, res, next) => {
  console.log(err);
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
      },
      "42703": {
        status: 400,
        msg: "Invalid input on query"
      },
      "23502": {
        status: 400,
        msg: "Bad request - incorrect input"
      },
      "23503": {
        status: 400,
        msg: "Bad request - input not valid"
      },
      "23505": {
        status: 400,
        msg: "Topic already exists! Please select existing topic"
      }
    };
    res
      .status(pSQLErrors[err.code].status)
      .send({ msg: pSQLErrors[err.code].msg });
  } else next(err);
};

const serverErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};

const send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

const noSuchRoute = (req, res, next) => {
  res.status(404).send({ msg: "Route not allowed" });
};

module.exports = {
  customErrorHandler,
  pSQLErrorHandling,
  serverErrorHandler,
  send405Error,
  noSuchRoute
};
