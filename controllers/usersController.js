const {
  fetchUserByUsername,
  addNewUser,
  fetchAllUsers
} = require("../models/usersModel");

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

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then(fetchedUsers => {
      res.status(200).send(fetchedUsers);
    })
    .catch(err => {
      next(err);
    });
};
