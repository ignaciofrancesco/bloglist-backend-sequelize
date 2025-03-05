require("dotenv").config();
const { Sequelize, QueryTypes, Model, DataTypes } = require("sequelize");

const express = require("express");
const app = express();

app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);

const syncBlog = async () => {
  await Blog.sync();
};

syncBlog();

/* ROUTES */

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = req.body;
    console.log(blog);

    const createdBlog = await Blog.create(blog);

    console.log(createdBlog);

    res.status(201).json(createdBlog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  const blogId = req.params.id;

  try {
    const result = await Blog.destroy({
      where: {
        id: blogId,
      },
    });

    res.status(204).json({ result });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

/* APP STARTUP */

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
