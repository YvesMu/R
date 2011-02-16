const { authJwtMiddleware } = require("../../lib/authentication");
const OrderController = require("./controller");

class OrderRouter {
  static getRouter() {
    const router = require("express").Router();

    const userMiddleware = authJwtMiddleware();

    router.route("/admin/sells-by-year").get(userMiddleware, OrderController.sellsByYear);
    router.route("/:id").get(userMiddleware, OrderController.getOrderById);
    router.route("/").get(userMiddleware, OrderController.getAllOrders);
    router.route("/").post(userMiddleware, OrderController.createOrder);

    return router;
  }
}

module.exports = OrderRouter;
