const bcrypt = require("bcrypt");
const knex = require("../db/client");

module.exports = {
  new(req, res) {
    res.render("users/new");
  },
  async create(req, res, next) {
    const { userName, email, password } = req.body;

    try {
      const passwordDigest = await bcrypt.hash(password, 10);
      const [id] = await knex("users")
        .insert({
          userName,
          email,
          passwordDigest
        })
        .returning("id");

      req.session.userId = id;

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
};
