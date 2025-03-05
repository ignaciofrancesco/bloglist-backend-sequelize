const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config.js");

// Sequelize configuration
const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Connect to db function

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database.");
  } catch (error) {
    console.log("Failed to connect to the database.");
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
