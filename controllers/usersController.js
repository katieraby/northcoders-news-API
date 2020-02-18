const { fetchUserByUsername } = require("../models/usersModel");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      res.status(200).send({ user: user.user[0] });
    })
    .catch(err => {
      next(err);
    });
};
