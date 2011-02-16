const { Schema } = require("mongoose");
const db = require("../service");

const mongoProductSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: false },
  slug: { type: String, required: false },
  description: { type: String, required: false },
  price: { type: Number, required: false },
  tax: { type: Number, required: false },
  status: { type: String, required: false },
});

const mongoCategorySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: false },
  slug: { type: String, required: false },
  description: { type: String, required: false },
  products: [mongoProductSchema],
  Products: [mongoProductSchema],
  status: { type: String, required: false },
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false },
});

const mongoCategory = db.model("Category", mongoCategorySchema);

module.exports = mongoCategory;
