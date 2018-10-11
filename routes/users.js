const express = require("express");
const router = express.Router();
const knex = require("../db/client");

const bcrypt = require('bcrypt');

router.get('/new', (req, res) => {
  res.render("users/new");
});

router.post('/', async (req, res) => {
  console.log(req.body);

  const { userName, email, password } = req.body;

  bcrypt.genSalt(10, async function(err, salt) {
    bcrypt.hash(password, salt, async function(err, passwordDigest) {
      const [id] = await knex("users")
      .insert({
        userName,
        email,
        passwordDigest
      })
      .returning("id");

      req.session.userId = id;
  
      res.redirect('/');
    });
  });
});

module.exports = router;

// const bcrypt = require('bcrypt');
// const genSalt =  async () => {
//   const salt = await bcrypt.genSalt(10)
//   return salt;
// }