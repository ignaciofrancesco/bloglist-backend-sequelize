const { Blog } = require("../models/index.js");
const { sequelize } = require("../utils/db.js");

const authorsRouter = require("express").Router();

authorsRouter.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("id")), "blogs_count"],
      [sequelize.fn("SUM", sequelize.col("likes")), "total_likes"],
    ],
    group: "author",
    order: [["total_likes", "DESC"]],
  });
  res.json(blogs);
});

module.exports = authorsRouter;

/* 
SELECT b.author, COUNT(b.id) as blogs_count, SUM(b.likes) as total_likes
FROM blogs b
GROUP BY b.author
ORDER BY total_likes DESC;

*/
