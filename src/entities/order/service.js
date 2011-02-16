const { Op } = require("sequelize");
const { ROLES } = require("../../../config");
const { Return } = require("../../lib");
const { Order, User, OrderLine, Product } = require("../../models");
const { mongoOrder } = require("../../database/mongodb/models");

class OrderService {
  static async getAllOrders(user) {
    if (user.role >= ROLES.accountant) return Return.from(mongoOrder.find());
    return Return.from(mongoOrder.find({ userId: user.id }));
  }

  static async getOrderById(user, orderId) {
    const order = await mongoOrder.findById(orderId);
    if (!order) return Return.error(404);
    if (user.role < ROLES.accountant && order.userId !== user.id) return Return.error(403);
    return Return.from(order);
  }

  static async createOrder(user, products) {
    const orderData = {};
    const orderUser = await User.findByPk(user.id);
    if (!orderUser) return Return.error(404);
    orderData.user_id = user.id;
    const orderLines = products.map((product) => ({ product_id: product.id, quantity: product.qty }));
    const orderProducts = await Product.findAll({
      where: { id: { [Op.in]: orderLines.map((line) => line.product_id) } },
    });
    for (let i = 0; i < orderProducts.length; i++) {
      if (orderProducts[i].stockVirtual < orderLines[i].quantity) {
        return Return.error({ code: 400, message: `Stocks insufisants pour '${orderProducts[i].name}'` });
      }
    }
    if (orderProducts.length !== orderLines.length) {
      return Return.error({ code: 422, message: "Produit inexistant" });
    }
    orderData.order_lines = orderLines;
    const lines = await OrderLine.bulkCreate(orderLines);
    const order = await Order.create({ user_id: user.id, statis: Order.STATUS_DRAFT });
    for (let i = 0; i < orderLines.length; i++) {
      await orderProducts[i].update({ stockVirtual: orderProducts[i].stockVirtual - orderLines[i].quantity });
    }
    for (const l of lines) {
      await OrderLine.update({ order_id: order.id }, { where: { id: l.id } });
    }
    const res = await Order.update({ status: Order.STATUS_VALIDATED }, { where: { id: order.id } });
    await order.reload();
    const mongoLines = await OrderLine.findAll({ where: { order_id: order.toJSON().id }, include: Product });
    const orderDataMongo = {
      ...order.toJSON(),
      lines: mongoLines.map((l) => l.toJSON()),
    };
    mongoOrder.create(orderDataMongo);
    return Return.from(res, 500, 201);
  }

  static async sellsByYear() {
    return Return.from(
      mongoOrder.aggregate([
        {
          $group: {
            _id: { $year: "$createdAt" },
            count: { $sum: 1 },
          },
        },
      ]),
    );
  }
}

module.exports = OrderService;
