exports.up = function(knex) {
  console.log("creating users table");
};

exports.down = function(knex) {
  console.log("dropping users table");
  return knex.schema.dropTable("users");
};
