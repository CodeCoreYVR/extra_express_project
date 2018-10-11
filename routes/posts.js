const express = require("express");
const router = express.Router();
const knex = require("../db/client");

// posts#new -> GET /posts/new
router.get("/new", (req, res) => {
  if(req.currentUser) {
    res.render("posts/new");
  } else {
    res.redirect('/');
  }
});

// posts#create -> POST /posts
router.post("/", async (req, res) => {
  // const imageUrl = req.body.imageUrl;
  // const title = req.body.title;
  // const content = req.body.content;
  // 👇 syntax sugar for 👆
  // Object destructuring
  const { imageUrl, title, content } = req.body;

  // knex("posts")
  //   .insert({
  //     imageUrl,
  //     title,
  //     content,
  //     viewCount: 0
  //   })
  //   .returning("id")
  //   // Use `returning` this to get the `id` of the post that
  //   // was just created
  //   .then(([id]) => {
  //     res.redirect(`/posts/${id}`);
  //   });
  // Use `returning` this to get the `id` of the post that
  // was just created

  const [id] = await knex("posts")
    .insert({
      imageUrl,
      title,
      content,
      viewCount: 0
    })
    .returning("id");

  res.redirect(`/posts/${id}`);
});

// Posts#index -> GET /posts
router.get("/", async (req, res) => {
  // knex("posts")
  //   .orderBy("createdAt", "desc")
  //   .then(posts => {
  //     res.render("posts/index", { posts });
  //   });

  // Whenever you need to use the method `then` with a callback to get a value
  // from asynchronous code, you can instead use keyword `await` to for that value
  // only inside functions or methods that are prefixed with the keyword `async`

  const posts = await knex("posts").orderBy("createdAt", "desc");
  res.render("posts/index", { posts });
});

// Posts#show -> Get /posts/:id
router.get("/:id", async (req, res, next) => {
  // In the URL above, all the names prefixed with
  // `:` are called URL params. You can access URL
  // params with `req.params`.
  const { id } = req.params;

  // knex("posts")
  //   .where("id", id)
  //   .first()
  //   // Knex method that works with select that will
  //   // return only the first post. Do this to avoid
  //   // having your post in an array.
  //   .then(post => {
  //     res.render("posts/show", { post });
  //   });

  // Use `try .. catch` blocks to prevent certain lines of code from crashing
  // your program.

  // Code between `try { <my-code> } catch ...` will be executed and if an
  // error is thrown, then the block following `catch` will be executed instead
  // of crashing your program.
  try {
    const post = await knex("posts")
      .where("id", id)
      .first();

    const comments = await knex("comments")
      .where("postId", post.id)
      .orderBy("createdAt", "desc");

    res.render("posts/show", { post, comments });
  } catch (error) {
    // If the code above, crashes we're going to take the `error` object and have
    // Express deal with using the `next` function.
    next(error);
  }
});

// Posts#destroy -> DELETE /posts/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  knex("posts")
    .where("id", id)
    .del()
    .then(() => {
      res.redirect("/posts");
    });
});

// Posts#edit -> GET /posts/:id/edit
router.get("/:id/edit", (req, res) => {
  const { id } = req.params;

  knex("posts")
    .where("id", id)
    .first()
    .then(post => {
      res.render("posts/edit", { post });
    });
});

// Posts#update -> PATCH /posts/:id
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { title, imageUrl, content } = req.body;

  knex("posts")
    .where("id", id)
    .update({
      title,
      imageUrl,
      content
    })
    .then(() => {
      res.redirect(`/posts/${id}`);
    });
});

module.exports = router;
