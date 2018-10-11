const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/session");
const usersController = require("../controllers/users");

// Session Routes
router.get("/session/new", sessionController.new);
router.post("/session", sessionController.create);
router.delete("/session", sessionController.destroy);

// Users Routes
router.get("/users/new", usersController.new);
router.post("/users", usersController.create);

module.exports = router;
