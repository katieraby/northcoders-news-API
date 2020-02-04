process.env.NODE_ENV = "test";
const app = require("../app");
const { expect } = require("chai");
const request = require("supertest");
const knex = require("../db/connection");

after(() => knex.destroy());

describe("/api", () => {
  beforeEach(() => knex.seed.run());
  describe("/topics", () => {
    it("GET - returns a 200 status code an an array of topic objects with slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an("array");
          expect(body.topics[0]).to.have.all.keys("slug", "description");
        });
    });
    it("GET - returns a status 404 - not found, and a message, when the user tries to access an unavailable route", () => {
      return request(app)
        .get("/api/topics/cheese")
        .expect(404)
        .then(({ err }) => {
          expect(err.msg).to.equal("Not found");
        });
    });
  });
});
