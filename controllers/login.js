const { User } = require("../models/index.js");
const { SALT_ROUNDS, JWT_SECRET } = require("../utils/config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginRouter = require("express").Router();

loginRouter.post("/", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const badRequestError = new Error("Username and password cannot be empty.");
    badRequestError.name = "BadRequestError";
    return next(badRequestError);
  }

  // Find the user by username
  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (!user) {
    const notFoundError = new Error("User not found.");
    notFoundError.name = "NotFoundError";
    return next(notFoundError);
  }

  // Compare the passwords using bcrypt
  const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);

  // If not authorized, next error
  if (!isCorrectPassword) {
    const unathorizedError = new Error("Wrong credentials.");
    unathorizedError.name = "UnauthorizedError";
    return next(unathorizedError);
  }

  // Else, create a token using jwt
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, JWT_SECRET);

  // Create the object to be returned
  const responseObject = { name: user.name, username, token };

  res.status(200).json(responseObject);
});

module.exports = loginRouter;
