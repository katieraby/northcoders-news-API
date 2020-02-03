exports.up = function(knex) {
  console.log("creating comments table");
};

exports.down = function(knex) {
  console.log("dropping comments table");
  return knex.schema.dropTable("comments");
};
