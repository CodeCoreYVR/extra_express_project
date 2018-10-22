
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", t => {
    t.increments("id");
    t.string("userName");
    t.string("email");
    t.string("passwordDigest"); // this stores salt + hashing of (salt + password)
    t.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};


// bcrypt.genSalt(10, function(err, salt) {
//   bcrypt.hash("supersecret", salt, function(err, hash) {
//       console.log(salt);
//       console.log(hash);
//   });
// });

// bcrypt.compare("asdfads", hash, function(err, res) {
//   console.log(res);
// });
// bcrypt.compare("supersecret", hash_with_salt, function(err, res) {
//   console.log(res);
// });