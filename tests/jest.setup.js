const mongoose = require('mongoose');
require('dotenv').config();

beforeAll(async () => {
  const mongoUri = `${process.env.MONGO_URL}/${process.env.DB_NAME}-test`;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch((error) => {
      console.error(`Unable to connect to the MongoDB database: ${error}`);
      throw new Error(`Unable to connect to the MongoDB database: ${error}`);
    });
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});
