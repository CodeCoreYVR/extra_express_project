exports.up = function(knex) {
  return knex.schema.createTable("posts", t => {
    // CREATE TABLE "posts" (
    t.increments("id"); // "id" SERIAL
    t.string("title"); // "title" VARCHAR(255)
    t.text("content"); // "content" TEXT
    t.integer("viewCount"); // "viewCount" INTEGER
    t.timestamp("createdAt").defaultTo(knex.fn.now()); // "createdAt" ...
    // )
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("posts");
};
