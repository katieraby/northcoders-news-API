const { fetchAllTopics, createTopic } = require("../models/topicsModel");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(allTopics => {
      res.status(200).send(allTopics);
    })
    .catch(err => {
      next(err);
    });
};

exports.postNewTopic = (req, res, next) => {
  createTopic(req.body)
    .then(postedTopic => {
      res.status(201).send(postedTopic);
    })
    .catch(err => {
      next(err);
    });
};
