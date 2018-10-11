const bcrypt = require("bcrypt");
const knex = require("../db/client");

module.exports = {
  new(req, res) {
    res.render("session/new");
  },
  async create(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await knex("users")
        .where("email", email)
        .first();

      if (user && (await bcrypt.compare(password, user.passwordDigest))) {
        req.session.userId = user.id;

        res.redirect("/");
      } else {
        res.render("session/new");
      }
    } catch (error) {
      next(error);
    }
  },
  destroy(req, res) {
    req.session.userId = undefined;

    res.redirect("/");
  }
};
