process.env.NODE_ENV = "test";
const app = require("../app");
const { expect } = require("chai");
const request = require("supertest");
const knex = require("../db/connection");

describe("/api", () => {
  beforeEach(() => knex.seed.run());
  after(() => knex.destroy());
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
  });

  describe("/users", () => {
    describe("/:username", () => {
      it("GET returns a status 200 and a user object when parametric username endpoint is accessed", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body }) => {
            expect(body.user[0].username).to.equal("rogersop");
            expect(body.user[0]).to.have.all.keys(
              "username",
              "avatar_url",
              "name"
            );
          });
      });

      it("GET - returns a status 404 and a message, when the user tries to get data for a user which doesnt exist", () => {
        return request(app)
          .get("/api/users/chickendinosaur")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("No user found for chickendinosaur");
          });
      });
    });
  });

  describe.only("/articles", () => {
    describe("/articles/:article_id", () => {
      it("GET - returns a status 200 and an article object with the ID passed at the parametric endpoint", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].title).to.equal(
              "Living in the shadow of a great man"
            );
            expect(body.article[0]).to.have.all.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });

      it("GET - returns a status 404 and an error message when passed an article ID that doesnt exist", () => {
        return request(app)
          .get("/api/articles/999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article ID 999 does not exist");
          });
      });

      it("GET - returns a status 400 and an error message when passed an article ID in the wrong format i.e. chars instead of numbers", () => {
        return request(app)
          .get("/api/articles/cat")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input -- must be an integer");
          });
      });
      it("PATCH - returns a status 200 and the updated article with votes increased when passed an object with a positive number of votes to add", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].votes).to.equal(110);
          });
      });
    });
  });
});
