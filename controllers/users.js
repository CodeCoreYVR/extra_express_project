const User = require("../models/user");

module.exports = {
  new(req, res) {
    res.render("users/new");
  },
  async create(req, res, next) {
    const { userName, email, password } = req.body;

    try {
      const user = new User({ userName, email, password });
      await user.save();

      req.session.userId = user.id;

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
};
