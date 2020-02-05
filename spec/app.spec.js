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

  describe("/articles", () => {
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

      it("PATCH - returns a status 200 and the udpated article with votes decreased when passed an object with a number of votes to decrease", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -50 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].votes).to.equal(50);
          });
      });

      it("PATCH - returns a status 400 and a bad request - incorrect input message when the body is empty -- no inc_votes can be found", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad request - incorrect input for update"
            );
          });
      });

      it("PATCH - returns a status 400 and an incorrect input message when the value of inc_votes is a format another than a number", () => {
        return request(app)
          .patch("/api/articles/4")
          .send({ inc_votes: "cat" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad request - incorrect input for update"
            );
          });
      });

      it("PATCH - returns a status 200 and the updated article, even when there is more than one property on the request body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, name: "Mitch" })
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].votes).to.equal(101);
          });
      });
    });
  });

  describe.only("/comments", () => {
    describe("/:comment_id", () => {
      it("PATCH - returns a status 200 and the updated comment when passed a number of votes (positive) by which to increment the vote count", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment[0].votes).to.equal(17);
            expect(body.comment[0]).to.have.all.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
          });
      });

      it("PATCH - returns a status 200 and the udpated comment with votes decreased when passed an object with a number of votes to decrease", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment[0].votes).to.equal(15);
          });
      });

      it("PATCH - returns a status 200 and the updated comment, even when there is more than one property on the request body", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 11, name: "Katie" })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment[0].votes).to.equal(27);
          });
      });

      it("PATCH - returns a status 400 and an incorrect input message when the value of inc_votes is a format another than a number", () => {
        return request(app)
          .patch("/api/comments/5")
          .send({ inc_votes: "cat" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad request - incorrect input for update"
            );
          });
      });

      it("PATCH - returns a status 400 and a bad request - incorrect input message when the body is empty -- no inc_votes can be found", () => {
        return request(app)
          .patch("/api/comments/3")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              "Bad request - incorrect input for update"
            );
          });
      });

      it("DELETE - responds with a 204 status code, and deletes the specified comment by ID", () => {
        return request(app)
          .delete("/api/comments/2")
          .expect(204);
      });
    });
  });
});
