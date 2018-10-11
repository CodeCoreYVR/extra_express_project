const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/session");
const usersController = require("../controllers/users");
const postsController = require("../controllers/posts");

// Session Routes
router.get("/session/new", sessionController.new);
router.post("/session", sessionController.create);
router.delete("/session", sessionController.destroy);

// Users Routes
router.get("/users/new", usersController.new);
router.post("/users", usersController.create);

// Posts Routes
router.get("/posts", postsController.index);
router.get("/posts/new", postsController.new);
router.get("/posts/:id", postsController.show);
router.get("/posts/:id/edit", postsController.edit);
router.post("/posts", postsController.create);
router.patch("/posts/:id", postsController.update);
router.delete("/posts/:id", postsController.destroy);

module.exports = router;
