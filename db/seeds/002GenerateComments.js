const faker = require("faker");

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex("comments").del();
  // Always return your knex query!!!
  const posts = await knex("posts").select("id");
  const postIds = posts.map(post => post.id);

  const userIds = await knex("users")
    .select("id")
    .map(u => u.id);

  const comments = Array.from({ length: 10000 }).map(() => ({
    content: faker.hacker.phrase(),
    postId: postIds[Math.floor(Math.random() * postIds.length)],
    userId: userIds[Math.floor(Math.random() * userIds.length)]
  }));

  // Always return your knex query!!!
  return await knex("comments").insert(comments);
};
