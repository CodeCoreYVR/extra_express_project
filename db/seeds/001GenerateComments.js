const faker = require("faker");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("comments")
    .del()
    .then(() => {
      // Always return your knex query!!!
      return knex("posts")
        .select("id")
        .then(posts => {
          const postIds = posts.map(post => post.id);

          const comments = Array.from({ length: 10000 }).map(() => ({
            content: faker.hacker.phrase(),
            postId: postIds[Math.floor(Math.random() * postIds.length)]
          }));

          // Always return your knex query!!!
          return knex("comments").insert(comments);
        });
    });
};
