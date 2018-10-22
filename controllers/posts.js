const { body, validationResult } = require("express-validator/check");
const express = require("express");
const knex = require("../db/client");

const router = express.Router();

const validatePost = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("Title must be present")
    .custom(async title => {
      if (
        await knex("posts")
          .where("title", title)
          .first()
      ) {
        throw new Error("Title must be unique");
      }
    }),
  body("content")
    .not()
    .isEmpty()
    .withMessage("Content must be present"),
  body("imageUrl")
    .not()
    .isEmpty()
    .withMessage("Image link must be present")
    .isURL({ require_protocol: true })
    .withMessage("Image link must be valid URL")
];

module.exports = {
  new(req, res) {
    if (req.currentUser) {
      res.render("posts/new", { post: {} });
    } else {
      res.redirect("/");
    }
  },

  create: [
    validatePost,
    async (req, res) => {
      const { imageUrl, title, content } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.render("posts/new", {
          post: { imageUrl, title, content },
          errors: errors.array()
        });
      }

      const [id] = await knex("posts")
        .insert({
          imageUrl,
          title,
          content,
          viewCount: 0
        })
        .returning("id");

      res.redirect(`/posts/${id}`);
    }
  ],
  async index(req, res) {
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
  },
  async show(req, res, next) {
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
  },
  destroy(req, res) {
    const { id } = req.params;

    knex("posts")
      .where("id", id)
      .del()
      .then(() => {
        res.redirect("/posts");
      });
  },
  edit(req, res) {
    const { id } = req.params;

    knex("posts")
      .where("id", id)
      .first()
      .then(post => {
        res.render("posts/edit", { post });
      });
  },
  update(req, res) {
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
  }
};
