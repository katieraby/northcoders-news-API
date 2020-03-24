const { fetchUserByUsername, addNewUser } = require("../models/usersModel");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      res.status(200).send(user);
    })
    .catch(err => {
      next(err);
    });
};

exports.postUser = (req, res, next) => {
  addNewUser(req.body)
    .then(postedUser => {
      res.status(201).send(postedUser);
    })
    .catch(err => {
      next(err);
    });
};
