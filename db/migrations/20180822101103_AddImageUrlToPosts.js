exports.up = function(knex, Promise) {
  return knex.schema.table("posts", t => {
    // ALTER TABLE "posts"
    t.string("imageUrl"); // ADD COLUMN "imageUrl" VARCHAR(255)
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("posts", t => {
    // ALTER TABLE "posts"
    t.dropColumn("imageUrl"); // DROP COLUMN "imageUrl"
  });
};
