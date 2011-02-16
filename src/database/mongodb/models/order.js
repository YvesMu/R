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

const mongoOrderLineSchema = new Schema({
  id: { type: String, required: false },
  product: mongoProductSchema,
  Product: mongoProductSchema,
  quantity: { type: Number, required: false },
  total: { type: Number, required: false },
});

const mongoOrderSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: false },
  lines: [mongoOrderLineSchema],
  total: { type: Number, required: false },
  status: { type: String, required: false },
  createdAt: { type: Date, required: false },
});

const mongoOrder = db.model("Order", mongoOrderSchema);

module.exports = mongoOrder;
