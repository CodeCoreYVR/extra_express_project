const knex = require("./db/client");

// Exercise: Inserting Posts
knex
  .insert([
    { title: "Top 5 Programming Languages", content: "PHP and stuff" },
    { title: "Top 10 Hikes", content: "The Grind and stuff" },
    { title: "You wouldn't believe...", content: "Yeah..." }
  ])
  .into("posts")
  .returning("*");
// .then(data => {
//   console.log(data);
//   knex.destroy(); // Closes connection to db
// });

// Exercise: Find Posts
// 1. Find all posts created within the last 2 months ordered by their
// createdAt date in a descending order

knex("posts")
  .select("*")
  .where("createdAt", ">", "now()", "-", `interval '2 months'`)
  .orderBy("createdAt", "desc");
// .then(console.log);

// 2. Find posts whose titles end with the letter "e"

knex("posts")
  .where("title", "ilike", "%e")
  .then(console.log);

// Doing a join
k("posts")
  // When joining, table columns with the same name will
  // replace keys with same in the returned data.
  // Make sure alias the columns that you want to keep.
  .select("id", "content", "comments.content as commentContent")
  .innerJoin("comments", "posts.id", "comments.postId")
  .then(console.log);
