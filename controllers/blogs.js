const { Blog } = require("../models/index.js");

const blogsRouter = require("express").Router();

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const blog = req.body;
  const createdBlog = await Blog.create(blog);
  res.status(201).json(createdBlog);
});

blogsRouter.put("/:id", async (req, res, next) => {
  const blogId = req.params.id;
  const newLikes = req.body.likes;

  if (!Number.isInteger(Number(blogId))) {
    const badRequestError = new Error("Invalid ID format");
    badRequestError.name = "BadRequestError";
    return next(badRequestError); // Pass the error to the error handler
  }

  const blog = await Blog.findByPk(blogId);

  if (!blog) {
    const notFoundError = new Error("Blog not found.");
    notFoundError.name = "NotFoundError";
    return next(notFoundError);
  }

  blog.likes = req.body.likes;

  const updatedBlog = await blog.save();

  console.log(updatedBlog);

  res.status(200).json({ likes: newLikes });
});

blogsRouter.delete("/:id", async (next, req, res) => {
  const blogId = req.params.id;

  if (!Number.isInteger(Number(blogId))) {
    const badRequestError = new Error("Invalid ID format");
    badRequestError.name = "BadRequestError";
    return next(badRequestError); // Pass the error to the error handler
  }

  const result = await Blog.destroy({
    where: {
      id: blogId,
    },
  });

  res.status(204).json({ result });
});

module.exports = blogsRouter;
