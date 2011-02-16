const { mongoCategory } = require("../../database/mongodb/models");
const { Return } = require("../../lib");
const { Category, Product } = require("../../models");

class CategoryService {
  static async getAllCategories() {
    return Return.from(
      Category.findAll({ include: [{ model: Product, where: { status: Product.STATUS_PUBLISHED } }] }),
    );
  }

  static async getAllCategoriesAdmin() {
    return Return.from(Category.findAll());
  }

  static async getCategoryById(id) {
    return Return.from(Category.findOne({ id }));
  }

  static async getCategoryBySlug(slug) {
    return Return.from(Category.findOne({ slug }));
  }

  static async createCategory(data) {
    const category = await Category.create(data);
    await mongoCategory.create(category.toJSON());
    return Return.from(category, 422, 201);
  }

  static async updateCategory(id, data) {
    await Category.update(data, { where: { id } });
    const category = await Category.findByPk(id, { include: Product });
    if (!category) {
      return Return.error(404, "Category not found");
    }
    await mongoCategory.deleteOne({ id });
    await mongoCategory.create(category.toJSON());
    return Return.from("", 422, 200);
  }

  static async deleteCategory(id) {
    await mongoCategory.deleteOne({ id });
    return Return.from(Category.destroy({ where: { id } }), 400, 204);
  }

  static async getSellsByCategoryByYear() {
    return Return.from(
      mongoCategory.aggregate([
        {
          $lookup: {
            from: "Products",
            localField: "id",
            foreignField: "categoryId",
            as: "Products",
          },
        },
        {
          $unwind: "$Products",
        },
        {
          $lookup: {
            from: "orders",
            localField: "Products.id",
            foreignField: "productId",
            as: "orders",
          },
        },
        {
          $unwind: "$orders",
        },
        {
          $group: {
            _id: { $year: "$orders.createdAt" },
            category: { $first: "$name" },
            sells: { $sum: "$orders.total" },
          },
        },
      ]),
    );
  }

  // static async getCategoriesWithProducts() {
  //   return Return.from(Category.findAll({ include: "products" }));
  // }

  // static async getCategoryWithProducts(id) {
  //   return Return.from(Category.findByPk(id, { include: "products" }));
  // }

  // static async addProductToCategory(categoryId, productId) {
  //   const category = await Category.findByPk(categoryId);
  //   const product = await Product.findByPk(productId);

  //   if (!category || !product) {
  //     return Return.error(404, "Category or Product not found");
  //   }

  //   await category.addProduct(product);
  //   return Return.success(200, category);
  // }
}

module.exports = CategoryService;
