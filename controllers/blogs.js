const Blog = require("../models/blog");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
  res.status(400).json({ error: error });
});

router.post("/", async (req, res) => {
  const blog = req.body;
  const createdBlog = await Blog.create(blog);
  res.status(201).json(createdBlog);
});

router.put("/:id", async (req, res, next) => {
  const blogId = req.params.id;
  const newLikes = req.body.likes;

  if (!Number.isInteger(Number(blogId))) {
    const error = new Error("Invalid ID format");
    error.name = "BadRequestError";
    return next(error); // Pass the error to the error handler
  }

  const blog = await Blog.findByPk(blogId);

  if (!blog) {
    const notFoundError = new Error("Blog not found.");
    notFoundError.name = "NotFoundError";
    return next(notFoundError);
  }

  blog.likes = req.body.likes;

  const updatedBlog = await blog.save();

  res.status(200).json({ likes: newLikes });
});

router.delete("/:id", async (req, res) => {
  const blogId = req.params.id;

  const result = await Blog.destroy({
    where: {
      id: blogId,
    },
  });

  res.status(204).json({ result });
});

module.exports = router;
