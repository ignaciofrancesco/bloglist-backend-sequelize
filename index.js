const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");

const blogsRouter = require("./controllers/blogs");

const express = require("express");
const app = express();

/* MIDDLEWARE 1 */

app.use(express.json());

/* ROUTES */

app.use("/api/blogs", blogsRouter);

/* APP STARTUP */

const startApp = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startApp();
