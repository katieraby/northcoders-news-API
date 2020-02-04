const { fetchAllTopics } = require("../models/topicsModel");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics().then(allTopics => {
    res.status(200).send(allTopics);
  });
};
