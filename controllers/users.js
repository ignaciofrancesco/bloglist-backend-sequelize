const { User } = require("../models/index.js");
const { SALT_ROUNDS } = require("../utils/config.js");
const bcrypt = require("bcrypt");

const usersRouter = require("express").Router();

usersRouter.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["hashedPassword", "id"] },
  });
  res.json(users);
});

usersRouter.post("/", async (req, res, next) => {
  const user = req.body;

  if (!user.password) {
    const badRequestError = new Error("The password field is mandatory.");
    badRequestError.name = "BadRequestError";
    return next(badRequestError);
  }

  const { name, username, password } = user;

  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const createdUser = await User.create({ name, username, hashedPassword });

  res.status(201).json(createdUser);
});

usersRouter.put("/:username", async (req, res, next) => {
  const username = req.params.id;
  const { newUsername } = req.body;

  if (!newUsername) {
    const badRequestError = new Error("The new username cannot be empty.");
    badRequestError.name = "BadRequestError";
    next(badRequestError);
  }

  // Find the user by username
  const user = await User.findOne({ attributes: username });

  if (!user) {
    const notFoundError = new Error("User not found.");
    notFoundError.name = "NotFoundError";
    next(notFoundError);
  }

  // Change the username value
  user.username = newUsername;

  // Save it back again to the db
  const updatedUser = await user.save();

  res.status(200).json(updatedUser);
});

// usersRouter.delete("/:id", async (next, req, res) => {
//   const userId = req.params.id;

//   if (!Number.isInteger(Number(userId))) {
//     const badRequestError = new Error("Invalid ID format");
//     badRequestError.name = "BadRequestError";
//     return next(badRequestError); // Pass the error to the error handler
//   }

//   const result = await User.destroy({
//     where: {
//       id: userId,
//     },
//   });

//   res.status(204).json({ result });
// });

module.exports = usersRouter;
