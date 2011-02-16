const { Schema } = require("mongoose");
const db = require("../service");

const mongoUserSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: false },
  email: { type: String, required: false },
  password: { type: String, required: false },
  status: { type: String, required: false },
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false },
});

const mongoUser = db.model("User", mongoUserSchema);

module.exports = mongoUser;
