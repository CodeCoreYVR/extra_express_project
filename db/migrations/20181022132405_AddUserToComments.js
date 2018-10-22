exports.up = function(knex, Promise) {
  return knex.schema.table("comments", t => {
    t.bigint("userId");

    t.foreign("userId")
      .references("id")
      .inTable("users");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("comments", t => {
    t.dropColumn("userId");
    // Dropping the column will also remove any foreign
    // key constraint set on it
  });
};
