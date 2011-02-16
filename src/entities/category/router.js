const { ROLES } = require("../../../config");
const { authJwtMiddleware } = require("../../lib/authentication");
const CategoryController = require("./controller");

class CategoryRouter {
  static getRouter() {
    const router = require("express").Router();

    const accountantMiddleware = authJwtMiddleware(ROLES.accountant);

    router.route("/admin/sells-by-year").get(accountantMiddleware, CategoryController.getSellsByCategoryByYear);
    router.route("/admin").get(accountantMiddleware, CategoryController.getAllCategoriesAdmin);
    router.route("/id/:id").get(accountantMiddleware, CategoryController.getCategoryById);
    router.route("/:slug").get(CategoryController.getCategoryBySlug);
    router.route("/:id").patch(accountantMiddleware, CategoryController.updateCategory);
    router.route("/:id").delete(accountantMiddleware, CategoryController.deleteCategory);
    router.route("/").get(CategoryController.getAllCategories);
    router.route("/").post(accountantMiddleware, CategoryController.createCategory);

    return router;
  }
}

module.exports = CategoryRouter;
