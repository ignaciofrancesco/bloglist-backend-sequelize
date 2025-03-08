require("dotenv").config();

const SALT_ROUNDS = 10;

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SALT_ROUNDS,
};
