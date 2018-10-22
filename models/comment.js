const knex = require("../db/client");

const distinctUserIds = objs =>
  Array.from(
    new Set(
      objs.map(c => parseInt(c.userId, 10)).filter(id => !Number.isNaN(id))
    )
  );

module.exports = class Comment {
  static async forPostWithUsers(postId) {
    const comments = await knex("comments")
      .where("postId", postId)
      .orderBy("createdAt", "desc")
      .returning("*");

    const userIds = distinctUserIds(comments);
    const users = await knex("users").whereIn("id", userIds);

    comments.forEach(
      c => (c.user = users.find(u => u.id === parseInt(c.userId)))
    );

    return comments;
  }
};
