const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("when passed an empty array, returns an empty array", () => {
    expect(formatDates([])).to.eql([]);
  });

  it("when passed an array with one object, doesn't mutate the original array", () => {
    const list = [
      {
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(formatDates(list)).to.not.equal(list);
  });

  it("the output object in the array has a different reference to the original object in the array", () => {
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
    expect(formatDates(list)[0]).to.not.equal(list[0]);
  });

  it("when passed an array with one object containing a created_at key, converts the milliseconds to date format", () => {
    const list = [
      {
        created_at: 1542284514171
      }
    ];
    const output = [
      {
        created_at: new Date(1542284514171)
      }
    ];
    expect(formatDates(list)).to.eql(output);
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
    expect(output[0]["created_at"]).to.eql(new Date(1542284514171));
    expect(output[1]["created_at"]).to.eql(new Date(1540084518901));
  });
});

describe("makeRefObj", () => {
  it("when passed an empty array, returns an empty object", () => {
    expect(makeRefObj([])).to.eql({});
  });

  it("the output object has a different reference to the original object in the array", () => {
    const input = [{ article_id: 1, title: "A" }];
    expect(makeRefObj(input)[0]).to.not.equal(input[0]);
  });

  it("when passed an array with one object, returns an object with the title and ID key value pair", () => {
    const input = [{ article_id: 1, title: "A" }];
    const expected = { A: 1 };
    expect(makeRefObj(input)).to.eql(expected);
  });

  it("when passed an array with two objects, returns an object with the titles as keys and the ID as values", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "D" }
    ];
    const expected = { A: 1, D: 2 };
    expect(makeRefObj(input)).to.eql(expected);
  });

  it("when passed an array with multiple objects which have additional keys, returns an object with just the title-ID key value pair", () => {
    const input = [
      { article_id: 1, title: "A", otherKey: 34 },
      { article_id: 2, title: "D", otherKey: 24 },
      { article_id: 3, title: "E", otherKey: 14 }
    ];
    const expected = { A: 1, D: 2, E: 3 };
    expect(makeRefObj(input)).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("when passed an empty array, returns an empty array", () => {
    expect(formatComments([])).to.eql([]);
  });

  it("when passed an array with one object, doesn't mutate the original array", () => {
    const comment = [
      {
        body:
          "Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.",
        belongs_to: "A BRIEF HISTORY OF FOOD—NO BIG DEAL",
        created_by: "weegembump",
        votes: 3,
        created_at: 1504946266488
      }
    ];
    const articleRefObj = {
      "Running a Node App": 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2,
      "22 Amazing open source React projects": 3,
      "A BRIEF HISTORY OF FOOD—NO BIG DEAL": 29
    };
    expect(formatComments(comment, articleRefObj)).to.not.equal(comment);
  });

  it("when passed one comment in an array of objects, and an article reference object, changes the created_by key to author, the belongs_to key to article_id key, and the created_at converted to a Javascript date object", () => {
    const articleRefObj = {
      "Running a Node App": 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2,
      "22 Amazing open source React projects": 3,
      "A BRIEF HISTORY OF FOOD—NO BIG DEAL": 29
    };
    const comment = [
      {
        body:
          "Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.",
        belongs_to: "A BRIEF HISTORY OF FOOD—NO BIG DEAL",
        created_by: "weegembump",
        votes: 3,
        created_at: 1504946266488
      }
    ];
    const expected = [
      {
        body:
          "Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.",
        article_id: 29,
        author: "weegembump",
        votes: 3,
        created_at: new Date(1504946266488)
      }
    ];
    const output = formatComments(comment, articleRefObj);

    expect(formatComments(comment, articleRefObj)).to.eql(expected);
    expect(output[0]).to.have.all.keys(
      "body",
      "article_id",
      "author",
      "votes",
      "created_at"
    );
  });

  it("when passed multiple comments in an array, changes the relevant properties as previous", () => {
    const comments = [
      {
        body:
          "Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.",
        belongs_to: "A BRIEF HISTORY OF FOOD—NO BIG DEAL",
        created_by: "weegembump",
        votes: 3,
        created_at: 1504946266488
      },
      {
        body:
          "Reiciendis enim soluta a sed cumque dolor quia quod sint. Laborum tempore est et quisquam dolore. Qui voluptas consequatur cumque neque et laborum unde sed. Impedit et consequatur tempore dignissimos earum distinctio cupiditate.",
        belongs_to: "Who are the most followed clubs and players on Instagram?",
        created_by: "happyamy2016",
        votes: 17,
        created_at: 1489789669732
      }
    ];
    const articleRefObj = {
      "Running a Node App": 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2,
      "22 Amazing open source React projects": 3,
      "A BRIEF HISTORY OF FOOD—NO BIG DEAL": 29,
      "Who are the most followed clubs and players on Instagram?": 14
    };
    const output = formatComments(comments, articleRefObj);
    expect(output[1]).to.have.all.keys(
      "body",
      "article_id",
      "author",
      "votes",
      "created_at"
    );
  });
});
