const User = require("../models/user");

module.exports = {
  new(req, res) {
    res.render("session/new");
  },
  async create(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findByEmail(email);

      if (user && (await user.authenticate(password))) {
        req.session.userId = user.id;

        req.flash("success", `Welcome back, ${user.userName}!`);
        res.redirect("/");
      } else {
        req.flash("danger", "Invalid Email or Password");
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
