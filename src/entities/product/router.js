const { ROLES } = require("../../../config");
const { authJwtMiddleware } = require("../../lib/authentication");
const ProductController = require("./controller");

class ProductRouter {
  static getRouter() {
    const router = require("express").Router();

    const accountantMiddleware = authJwtMiddleware(ROLES.accountant);

    router.route("/admin").get(accountantMiddleware, ProductController.getAllProductsAdmin);
    router.route("/id/:id").get(accountantMiddleware, ProductController.getProductById);
    router.route("/:id/stock").patch(accountantMiddleware, ProductController.updateStock);
    router.route("/:slug").get(ProductController.getProductBySlug);
    router.route("/:id").patch(accountantMiddleware, ProductController.updateProduct);
    router.route("/:id").delete(accountantMiddleware, ProductController.deleteProduct);
    router.route("/").get(ProductController.getAllProducts);
    router.route("/").post(accountantMiddleware, ProductController.createProduct);

    return router;
  }
}

module.exports = ProductRouter;
