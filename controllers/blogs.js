const { Blog, User } = require("../models/index.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config.js");
const { findOne, findByPk } = require("../models/blog.js");
const { Op } = require("sequelize");

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
  const searchWord = req.query.search;

  let where;

  if (searchWord) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${searchWord}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${searchWord}%`,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    include: { model: User, attributes: { exclude: ["hashedPassword"] } },
    where,
    order: [["likes", "DESC"]],
  });
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

blogsRouter.delete("/:id", tokenExtractor, async (req, res, next) => {
  console.log(req.params);
  console.log(req.decodedToken);

  const blogId = req.params.id;
  const loggedUserId = Number(req.decodedToken.id);

  if (!Number.isInteger(Number(blogId))) {
    const badRequestError = new Error("Invalid ID format");
    badRequestError.name = "BadRequestError";
    return next(badRequestError); // Pass the error to the error handler
  }

  const blog = await Blog.findByPk(blogId);

  if (loggedUserId !== blog.userId) {
    const unauthorizedError = new Error(
      "Cannot delete a blog that is not yours."
    );
    unauthorizedError.name = "UnauthorizedError";
    return next(unauthorizedError);
  }

  const result = await Blog.destroy({
    where: {
      id: blogId,
    },
  });

  res.status(204).json({ result });
});

module.exports = blogsRouter;
