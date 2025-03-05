require("dotenv").config();

const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const printBlogs = async () => {
  const blogs = await sequelize.query("SELECT * FROM blogs", {
    type: QueryTypes.SELECT,
  });

  blogs.forEach((b) => {
    console.log(`${b.author}: '${b.title}' ${b.likes} likes.`);
  });
};

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await printBlogs();

    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();

/* Exercise 13.3.
Create a functionality in your application which prints the blogs in the database on the command-line, e.g. as follows:

$ node cli.js
Executing (default): SELECT * FROM blogs
Dan Abramov: 'On let vs const', 0 likes
Laurenz Albe: 'Gaps in sequences in PostgreSQL', 0 likes */
