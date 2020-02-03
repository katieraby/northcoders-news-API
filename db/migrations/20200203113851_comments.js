exports.up = function(knex) {
  console.log("creating comments table");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable
      .string("author")
      .references("username")
      .inTable("users")
      .notNullable();
    commentsTable
      .integer("article_id")
      .references("article_id")
      .inTable("articles")
      .notNullable();
    commentsTable
      .integer("votes")
      .defaultTo(0)
      .notNullable();
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  console.log("dropping comments table");
  return knex.schema.dropTable("comments");
};
