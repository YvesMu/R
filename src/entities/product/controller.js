const { checkProps } = require("../../lib/helpers");
const ProductService = require("./service");

class ProductController {
  static async getAllProducts(req, res) {
    const { code, data } = await ProductService.getAllProducts(req);
    return res.status(code).json(data);
  }

  static async getAllProductsAdmin(req, res) {
    const { code, data } = await ProductService.getAllProductsAdmin(req);
    return res.status(code).json(data);
  }

  static async getProductBySlug(req, res) {
    const { code, data } = await ProductService.getProductBySlug(req.params.slug);
    return res.status(code).json(data);
  }

  static async getProductById(req, res) {
    const { code, data } = await ProductService.getProductById(req.params.id);
    return res.status(code).json(data);
  }

  static async createProduct(req, res) {
    const check = checkProps(req.body, ["name"]);
    if (!check.ok) return res.status(check.code).json(check.data);
    const { code, data } = await ProductService.createProduct(req.body);
    return res.status(code).json(data);
  }

  static async updateProduct(req, res) {
    const { name, description, status, alert, stockReal, stockVirtual, tax } = req.body;
    const { code, data } = await ProductService.updateProduct(req.params.id, {
      name,
      description,
      status,
      alert,
      stockReal,
      stockVirtual,
      tax,
    });
    return res.status(code).json(data);
  }

  static async deleteProduct(req, res) {
    const { code, data } = await ProductService.deleteProduct(req.params.id);
    return res.status(code).json(data);
  }

  static async updateStock(req, res) {
    const { stock } = req.body;
    const { code, data } = await ProductService.updateStock(req.params.id, stock);
    return res.status(code).json(data);
  }
}

module.exports = ProductController;
