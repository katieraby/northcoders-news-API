const ENV = process.env.NODE_ENV || "development";
const testData = require("./test-data");
const devData = require("./development-data");

const data = {
  development: devData,
  test: testData
};

module.exports = data[ENV];
