const mongoose = require("mongoose");

const { MONGO_URL: url, DB_NAME: database } = process.env;

console.log(`Connecting to mongodb at ${url}/${database}`);

mongoose
  .connect(`${url}/${database}`, {
    auth: { username: "root", password: "root" },
    authSource: "admin",
  })
  .then(() => {
    console.log("Mongodb connection has been established successfully.");
  })
  .catch((error) => {
    throw new Error(`Unable to connect to the mongodb database: ${error}`);
  });

module.exports = mongoose.connection;
