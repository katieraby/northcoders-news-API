exports.up = function(knex) {
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable
      .increments("article_id")
      .primary()
      .notNullable();
    articlesTable.string("title").notNullable();
    articlesTable.text("body").notNullable();
    articlesTable
      .integer("votes")
      .defaultTo(0)
      .notNullable();
    articlesTable
      .string("topic")
      .references("slug")
      .inTable("topics")
      .notNullable()
      .onDelete("CASCADE");
    articlesTable
      .string("author")
      .references("username")
      .inTable("users")
      .notNullable()
      .onDelete("CASCADE");
    articlesTable
      .timestamp("created_at")
      .defaultTo(knex.fn.now())
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
