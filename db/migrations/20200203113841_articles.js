exports.up = function(knex) {
  console.log("creating articles table");
};

exports.down = function(knex) {
  console.log("dropping articles table");
  return knex.schema.dropTable("articles");
};
