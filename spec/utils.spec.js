const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe.only("formatDates", () => {
  it("when passed an empty array, returns an empty array", () => {
    expect(formatDates([])).to.eql([]);
  });

  it("when passed an array with one object containing a created_at key, converts the milliseconds to date format", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const output = formatDates(list);
    expect(output[0]["created_at"]).to.equal("Thu, 15 Nov 2018 12:21:54 GMT");
  });

  it("when passed an array with multiple objects, converts the created_at value from milliseconds to date format", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: "Living in the shadow of a great man",
        topic: "hello",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1540084518901,
        votes: 80
      }
    ];

    const output = formatDates(list);
    expect(output[0]["created_at"]).to.equal("Thu, 15 Nov 2018 12:21:54 GMT");
    expect(output[1]["created_at"]).to.equal("Sun, 21 Oct 2018 01:15:18 GMT");
  });
});

describe("makeRefObj", () => {
  it("when passed an empty array, returns an empty object", () => {
    expect(makeRefObj([])).to.eql({});
  });

  it("when passed an array with one object, returns an object with the title and ID key value pair", () => {
    const input = [{ article_id: 1, title: "A" }];
    const expected = { A: 1 };
    expect(makeRefObj(input, "title", "article_id")).to.eql(expected);
  });

  it("when passed an array with two objects, returns an object with the titles as keys and the ID as values", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "D" }
    ];
    const expected = { A: 1, D: 2 };
    expect(makeRefObj(input, "title", "article_id")).to.eql(expected);
  });

  it("when passed an array with multiple objects which have additional keys, returns an object with just the title-ID key value pair", () => {
    const input = [
      { article_id: 1, title: "A", otherKey: 34 },
      { article_id: 2, title: "D", otherKey: 24 },
      { article_id: 3, title: "E", otherKey: 14 }
    ];
    const expected = { A: 1, D: 2, E: 3 };
    expect(makeRefObj(input, "title", "article_id")).to.eql(expected);
  });
});

describe("formatComments", () => {});
