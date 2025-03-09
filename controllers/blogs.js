const { Blog } = require("../models/index.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config.js");
const { findOne, findByPk } = require("../models/blog.js");

const blogsRouter = require("express").Router();

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      // It verifies the validity of the token. If it is invalid, it throws an exception.
      req.decodedToken = jwt.verify(authorization.substring(7), JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }

  next();
};

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

blogsRouter.post("/", tokenExtractor, async (req, res) => {
  // If i get to this place, the token as already been validated.

  const blog = req.body;
  const { username, id } = req.decodedToken;

  // Assign the new blog the user id
  const createdBlog = await Blog.create({ ...blog, userId: id });

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
