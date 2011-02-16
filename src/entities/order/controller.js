const OrderService = require("./service");

class OrderController {
  static async getAllOrders(req, res) {
    const { code, data } = await OrderService.getAllOrders(req.user);
    return res.status(code).json(data);
  }

  static async getOrderById(req, res) {
    const { code, data } = await OrderService.getOrderById(req.user, req.params.id);
    return res.status(code).json(data);
  }

  static async createOrder(req, res) {
    const { products } = req.body;
    const { code, data } = await OrderService.createOrder(req.user, products);
    return res.status(code).json(data);
  }

  static async sellsByYear(req, res) {
    const { code, data } = await OrderService.sellsByYear();
    return res.status(code).json(data);
  }
}

module.exports = OrderController;
