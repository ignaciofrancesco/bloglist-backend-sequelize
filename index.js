const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");
require("express-async-errors");

const blogsRouter = require("./controllers/blogs");

const express = require("express");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const app = express();

/* MIDDLEWARE 1 */

app.use(express.json());

/* ROUTES */

app.use("/api/login", loginRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/authors", authorsRouter);

/* MIDDLEWARE 2 */

const errorHandler = (error, req, res, next) => {
  console.log(error.stack);

  // Sequelize errors
  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: "Malformed request" });
  }

  if (error.name === "SequelizeValidationError") {
    return res
      .status(400)
      .json({ error: error.errors.map((e) => e.message).join(", ") });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: "Duplicate entry detected" });
  }

  // Other common errors, that i have to create and next myself.
  if (error.name === "BadRequestError") {
    return res.status(400).json({ error: error.message });
  }

  if (error.name === "NotFoundError") {
    return res.status(404).json({ error: error.message });
  }

  if (error.name === "UnauthorizedError") {
    return res.status(401).json({ error: error.message });
  }
  // Unknown errors, let the built in error handler do it
  next(error);
};

app.use(errorHandler);

/* APP STARTUP */

const startApp = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startApp();
