const path = require("path");

exports.getAllEndpoints = (req, res, next) => {
  res.sendFile("endpoints.json", { root: path.join(__dirname, "../") });
};
