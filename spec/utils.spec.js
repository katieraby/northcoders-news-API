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

  it("when passed an array with one object containing a created_at key, converts the miliseconds to date format", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    console.log(input[0]["created_at"]);
    expect(formatDates(input[0]["created_at"])).to.contain("GMT");
  });
});

// {
//   title: 'Living in the shadow of a great man',
//     topic: 'mitch',
//       author: 'butter_bridge',
//         body: 'I find this existence challenging',
//           created_at: 1542284514171,
//             votes: 100,
//   },

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
