const faker = require("faker");
const User = require("../../models/user");

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex("comments").del();
  await knex("users").del();

  const password = "supersecret";

  const superUser = await new User({
    userName: "jsnow",
    email: "js@winterfell.gov",
    password
  }).save();

  for (let i = 0; i < 10; i += 1) {
    await new User({
      userName: faker.internet.userName(),
      email: faker.internet.email(),
      password
    }).save();
  }

  // await Promise.all(
  //   Array.from({ length: 10 }).map(() =>
  //     new User({
  //       userName: faker.internet.userName(),
  //       email: faker.internet.email(),
  //       password
  //     }).save()
  //   )
  // );
};
