process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const knex = require("../db/connection");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);
const { expect } = chai;

describe("/api", () => {
  beforeEach(() => knex.seed.run());
  after(() => knex.destroy());
  it("GET - returns a JSON containing all of the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).to.haveOwnProperty("GET /api");
        expect(body).to.haveOwnProperty("GET /api/articles");
      });
  });
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

    describe("INVALID METHODS", () => {
      it("Status:405", () => {
        const invalidMethods = ["patch", "post", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
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
            expect(body.user.username).to.equal("rogersop");
            expect(body.user).to.have.all.keys(
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

      describe("INVALID METHODS", () => {
        it("Status:405", () => {
          const invalidMethods = ["patch", "post", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/:username")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });

    describe("INVALID METHODS", () => {
      it("Status:405", () => {
        const invalidMethods = ["get", "patch", "post", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/users")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });

  describe("/articles", () => {
    it("GET - returns a status 200 and an array of article objects, defaulting to be sorted by date when no sort by query is provided in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles[0]).to.have.all.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "body",
            "comment_count"
          );
          expect(body.articles).to.be.descendingBy("created_at");
        });
    });

    it("GET - returns a status 200 and all articles sorted by author in ascending order when passed an author sort by and ascending order by query", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.ascendingBy("title");
        });
    });

    it("GET - returns a status 400 and an error message when passed an invalid sort by query", () => {
      return request(app)
        .get("/api/articles?sort_by=dragons")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input on query");
        });
    });

    it("GET - returns a status 200 and all articles default sorted by created_at, and filtered by author when passed an author in the query ", () => {
      return request(app)
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.descendingBy("created_at");
          expect(body.articles[0].author).to.equal("rogersop");
        });
    });

    it("GET - returns a status 200 and all articles filtered by topic when passed a topic in the query, default sorted by created_at and descending", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.descendingBy("created_at");
          expect(body.articles[0].topic).to.equal("cats");
        });
    });

    it("GET returns a status 400 and an error message where an invalid column is passed into the sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=chicken")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid input on query");
        });
    });

    it("GET returns a status 404 when passed a non-existent author", () => {
      return request(app)
        .get("/api/articles?author=princessturkey")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Author does not exist");
        });
    });

    it("GET returns a status 200 and an empty array with passed an author that exists but has no articles associated", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.eql([]);
        });
    });

    it("GET returns a status 200 and a limited array of articles when passed a limit query", () => {
      return request(app)
        .get("/api/articles?limit=6")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(6);
        });
    });

    it("GET - returns a status 200 an array of articles limited to 10 on page 2 (articles 10-12)", () => {
      return request(app)
        .get("/api/articles?p=2")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles.length).to.equal(2);
        });
    });

    describe("/:article_id", () => {
      it("GET - returns a status 200 and an article object with the ID passed at the parametric endpoint", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article.title).to.equal(
              "Living in the shadow of a great man"
            );
            expect(body.article).to.have.all.keys(
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
            expect(body.article.votes).to.equal(110);
          });
      });

      it("PATCH - returns a status 200 and the udpated article with votes decreased when passed an object with a number of votes to decrease", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -50 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(50);
          });
      });

      it("PATCH - returns a status 400 and an incorrect input message when the value of inc_votes is a format another than a number", () => {
        return request(app)
          .patch("/api/articles/4")
          .send({ inc_votes: "cat" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input -- must be an integer");
          });
      });

      it("PATCH - returns a status 200 and the updated article, even when there is more than one property on the request body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, name: "Mitch" })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(101);
          });
      });

      describe("/comments", () => {
        it("POST - responds with a status 201 and the posted comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({
              username: "rogersop",
              body: "Hello world, my first comment"
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.comment).to.have.all.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
              expect(body.comment.author).to.equal("rogersop");
            });
        });

        it("POST - responds with a status 404 when the passed article ID does not exist", () => {
          return request(app)
            .post("/api/articles/999/comments")
            .send({
              username: "rogersop",
              body: "Hello world, my first comment"
            })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Article ID 999 does not exist");
            });
        });

        it("POST - responds with a status 400 when there are keys missing from the body", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({
              username: "rogersop"
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request - incorrect input");
            });
        });

        it("POST - responds with a status 201 and the posted comment even when there are additional keys on the request body", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({
              username: "rogersop",
              body: "Hello world, my first comment",
              favouriteFood: "pizza"
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.comment).to.have.all.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
              expect(body.comment.author).to.equal("rogersop");
            });
        });

        it("GET - returns a status 200 and an array of comments", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.an("array");
              expect(body.comments[0]).to.have.all.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
        });

        it("GET - returns a status 200 and an array of comments limited by the passed limit query, or defaults to 10", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=8")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.an("array");
              expect(body.comments.length).to.equal(8);
            });
        });

        it("GET - returns a status 200 an array of comments limited to 10 on page 2 (comments 10-15)", () => {
          return request(app)
            .get("/api/articles/1/comments?p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.an("array");
              expect(body.comments.length).to.equal(6);
            });
        });

        it("GET - returns a 200 status code and an empty array when the article exists but has no comments", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.eql({ comments: [] });
            });
        });

        it("GET - returns a 404 status code and an error message when the article ID doesnt exist", () => {
          return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid article ID provided");
            });
        });

        it("GET - returns a status 200 and an array of comments sorted by created_at when passed a sort_by query, defaulting to descending order", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=created_at")
            .expect(200)
            .then(({ body }) => {
              const { comments } = body;
              expect(comments).to.be.descendingBy("created_at");
            });
        });

        it("GET - returns a status 200 and an array of comments sorted by created_at when passed a sort_by query, and an order query of ascending", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=created_at&order=asc")
            .expect(200)
            .then(({ body }) => {
              const { comments } = body;
              expect(comments).to.be.ascendingBy("created_at");
            });
        });

        it("GET - returns a status 200 and an array of comments sorted by votes when passed a sort_by query, defaulting to descending order", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              const { comments } = body;
              expect(comments).to.be.descendingBy("votes");
            });
        });

        it("GET - returns a status 200 and an array of comments sorted default by created_at, when only passed an order query", () => {
          return request(app)
            .get("/api/articles/1/comments?order=asc")
            .expect(200)
            .then(({ body }) => {
              const { comments } = body;
              expect(comments).to.be.ascendingBy("created_at");
            });
        });

        it("GET - returns a status 200 and the comments sorted in the default order when passed an invalid order query", () => {
          return request(app)
            .get("/api/articles/1/comments?order=fruit")
            .expect(200)
            .then(({ body }) => {
              const { comments } = body;
              expect(comments).to.be.descendingBy("created_at");
            });
        });

        it("GET - returns a status 200 and the comments sorted by created_at when passed an invalid sort_by query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=dragons")
            .expect(200)
            .then(({ body }) => {
              const { comments } = body;
              expect(comments).to.be.descendingBy("created_at");
            });
        });

        describe("INVALID METHODS", () => {
          it("Status:405", () => {
            const invalidMethods = ["patch", "delete", "put"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/:article_id/comments")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });

      describe("INVALID METHODS", () => {
        it("Status:405", () => {
          const invalidMethods = ["post", "delete", "put"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/:article_id")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });

    describe("INVALID METHODS", () => {
      it("Status:405", () => {
        const invalidMethods = ["patch", "post", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });

  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("PATCH - returns a status 200 and the updated comment when passed a number of votes (positive) by which to increment the vote count", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(17);
            expect(body.comment).to.have.all.keys(
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
            expect(body.comment.votes).to.equal(15);
          });
      });

      it("PATCH - returns a status 200 and the updated comment, even when there is more than one property on the request body", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 11, name: "Katie" })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(27);
          });
      });

      it("PATCH - returns a status 400 and an incorrect input message when the value of inc_votes is a format another than a number", () => {
        return request(app)
          .patch("/api/comments/5")
          .send({ inc_votes: "cat" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input -- must be an integer");
          });
      });

      it("PATCH - returns a status 200 and an unchanged comment when the body is empty -- no inc_votes can be found", () => {
        return request(app)
          .patch("/api/comments/3")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(100);
          });
      });

      it("PATCH - returns a status 404 and an error message when passed a valid comment id that does not exist", () => {
        return request(app)
          .patch("/api/comments/9999")
          .send({})
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Comment ID not found");
          });
      });

      it("DELETE - responds with a 204 status code, and deletes the specified comment by ID", () => {
        return request(app)
          .delete("/api/comments/2")
          .expect(204);
      });

      it("DELETE - responds with a 404 status code when the passed ID doesnt exist", () => {
        return request(app)
          .delete("/api/comments/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Comment ID not found");
          });
      });

      it("DELETE - responds with a 400 status code when the passed ID is in the wrong format i.e. nine instead of 9", () => {
        return request(app)
          .delete("/api/comments/nine")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input -- must be an integer");
          });
      });
    });
  });
});
