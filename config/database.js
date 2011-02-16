require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
    define: {
      underscored: true,
      paranoid: true,
      hooks: {
        beforeCreate: (attributes, options) => {
          options.returning = true;
        },
      },
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
    logging: false,
    define: {
      underscored: true,
      paranoid: true,
      hooks: {
        beforeCreate: (attributes, options) => {
          options.returning = true;
        },
      },
    },
  },
};
