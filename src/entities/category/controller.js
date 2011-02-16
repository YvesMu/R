const { checkProps } = require("../../lib/helpers");
const CategoryService = require("./service");

class CategoryController {
  static async getAllCategories(req, res) {
    const { code, data } = await CategoryService.getAllCategories();
    return res.status(code).json(data);
  }

  static async getAllCategoriesAdmin(req, res) {
    const { code, data } = await CategoryService.getAllCategoriesAdmin();
    return res.status(code).json(data);
  }

  static async getCategoryById(req, res) {
    const { code, data } = await CategoryService.getCategoryById(req.params.id);
    return res.status(code).json(data);
  }

  static async getCategoryBySlug(req, res) {
    const { code, data } = await CategoryService.getCategoryBySlug(req.params.slug);
    return res.status(code).json(data);
  }

  static async createCategory(req, res) {
    const check = checkProps(req.body, ["name"]);
    if (!check.ok) return res.status(check.code).json(check.data);

    const { name, description } = req.body;
    const { code, data } = await CategoryService.createCategory({ name, description });
    return res.status(code).json(data);
  }

  static async updateCategory(req, res) {
    const { name, description, status } = req.body;
    const { code, data } = await CategoryService.updateCategory(req.params.id, { name, description, status });
    return res.status(code).json(data);
  }

  static async deleteCategory(req, res) {
    const { code, data } = await CategoryService.deleteCategory(req.params.id);
    return res.status(code).json(data);
  }

  static async getSellsByCategoryByYear(req, res) {
    const { code, data } = await CategoryService.getSellsByCategoryByYear();
    return res.status(code).json(data);
  }
}

module.exports = CategoryController;
