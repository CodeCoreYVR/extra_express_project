const faker = require("faker");

// Returns random number from 1 to n inclusive
const random = n => Math.ceil(Math.random() * n);

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return knex("posts")
    .del()
    .then(() => {
      const posts = Array.from({ length: 100 }).map(() => ({
        title: faker.company.catchPhrase(),
        content: faker.lorem.paragraph(),
        imageUrl: faker.image.imageUrl(),
        viewCount: random(10000),
        createdAt: faker.date.recent()
      }));

      // Even inside a then-callback, always return
      // the query.
      return knex("posts").insert(posts);
    });
};
