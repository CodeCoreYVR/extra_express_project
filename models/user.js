const bcrypt = require("bcrypt");
const knex = require("../db/client");

class User {
  constructor({ id, userName, email, password, passwordDigest, createdAt }) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.passwordDigest = passwordDigest;
    this.createdAt = createdAt;
  }

  // static creates a class method
  // The method is a propert of the class object
  // You use it like so: User.find(10)
  // def self.find(id)
  static async find(id) {
    const userRaw = await knex("users")
      .where("id", id)
      .first();

    return new User(userRaw);
  }

  static async findByEmail(email) {
    const userRaw = await knex("users")
      .where("email", email)
      .first();

    return new User(userRaw);
  }

  async save() {
    const { userName, email, password } = this;

    const [{ id, createdAt }] = await knex("users")
      .insert({
        userName,
        email,
        passwordDigest: await bcrypt.hash(password, 10)
      })
      .returning("*");

    this.id = id;
    this.createdAt = createdAt;

    return this;
  }

  async authenticate(password) {
    return await bcrypt.compare(password, this.passwordDigest);
  }
}

module.exports = User;
