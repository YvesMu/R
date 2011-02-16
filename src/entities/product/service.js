const { Op } = require("sequelize");
const { Return } = require("../../lib");
const { Product, Category } = require("../../models");
const { ROLES } = require("../../../config");
const { mongoCategory } = require("../../database/mongodb/models");

class ProductService {
  static async getAllProducts(req) {
    const where = {};
    console.log("req.user", req.user);
    if (!req.user || req.user.role == ROLES.user) where.status = Product.STATUS_PUBLISHED;
    const categoryWhere = {};
    const { q, price = "", sort, categ = "" } = req.query;
    if (q) {
      where[Op.or] = [{ name: { [Op.iLike]: `%${q}%` } }, { description: { [Op.iLike]: `%${q}%` } }];
    }
    if (price) {
      const [priceLow = 0, priceHigh = Number.MAX_SAFE_INTEGER] = price.split("-").map(Number);
      where.price = { [Op.between]: [priceLow, priceHigh] };
    }
    if (categ) {
      categoryWhere.slug = categ;
    }
    const productSort = ["relevance", "lth", "htl", "new"].includes(sort) ? sort : "relevance";
    let order = [];
    switch (productSort) {
      case "lth":
        order = [["price", "ASC"]];
        break;
      case "htl":
        order = [["price", "DESC"]];
        break;
      case "new":
        order = [["createdAt", "DESC"]];
        break;
      default:
        order = [["id", "ASC"]];
    }
    return Return.from(Product.findAll({ where, order, include: [{ model: Category, where: categoryWhere }] }));
  }

  static async getAllProductsAdmin() {
    return Return.from(Product.findAll({ include: [{ model: Category }] }));
  }

  static async getProductBySlug(slug) {
    return Return.from(Product.findOne({ slug }));
  }

  static async getProductById(id) {
    return Return.from(Product.findByPk(id));
  }

  static async createProduct(data) {
    const { category } = data;
    if (!category) {
      return Return.error(422);
    }
    const categoryInstance = await Category.findByPk(category);
    if (!categoryInstance) {
      return Return.error(422);
    }
    const newProduct = await Product.create(data);
    await Product.update({ categoryId: categoryInstance.id }, { where: { id: newProduct.id } });
    newProduct.reload();
    await mongoCategory.deleteOne({ id: categoryInstance.id });
    const categoryData = await Category.findByPk(categoryInstance.id, { include: Product });
    await mongoCategory.create(categoryData.toJSON());
    return Return.from("", 422, 201);
  }

  static async updateProduct(id, data) {
    await Product.update(data, { where: { id } });
    const product = await Product.findByPk(id);
    if (!product) {
      return Return.error(404);
    }
    await mongoCategory.deleteOne({ id: product.categoryId });
    const categoryData = await Category.findByPk(product.categoryId, { include: Product });
    await mongoCategory.create(categoryData.toJSON());
    return Return.from("", 422);
  }

  static async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) {
      return Return.error(404);
    }
    const categoryId = product.categoryId;
    await product.destroy();
    await mongoCategory.deleteOne({ id: categoryId });
    const categoryData = await Category.findByPk(categoryId, { include: Product });
    if (!categoryData) {
      return Return.error(404);
    }
    await mongoCategory.create(categoryData.toJSON());
    return Return.from("", 400, 204);
  }

  static async updateStock(id, stock) {
    return Return.from(Product.update({ stock }, { where: { id } }));
  }
}

module.exports = ProductService;
