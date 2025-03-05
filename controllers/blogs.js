const Blog = require("../models/blog");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.post("/", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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

module.exports = router;
