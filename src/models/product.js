const { Op } = require("sequelize");
const { slugify } = require("../lib/helpers");
const BaseModel = require("./_base");

module.exports = (sequelize, DataTypes) => {
  class Product extends BaseModel {
    static STATUS_DRAFT = 0;
    static STATUS_PUBLISHED = 1;

    getTTCPrice() {
      return this.price * (1 + this.tax);
    }

    static async create(product = undefined, options = undefined) {
      if (product && product.name) {
        product.name = product.name.trim();
        product.slug = await this.setSlug(product.name);
      }
      return super.create(product, { returing: true, ...options });
    }

    static async update(product = undefined, options = undefined) {
      if (product && product.name) {
        product.name = product.name.trim();
        product.slug = await this.setSlug(product.name);
      }
      return super.update(product, { returing: true, ...options });
    }

    static async setSlug(from) {
      let baseSlug = slugify(from);
      let slug = baseSlug;
      let count = 0;
      let exists = true;

      const productsWithSameSlug = await this.findAll({ where: { slug: { [Op.like]: `${baseSlug}%` } } });

      do {
        const existing = productsWithSameSlug.find((c) => c.slug === slug);
        if (!existing) {
          exists = false;
          break;
        } else {
          count++;
          slug = `${baseSlug}-${count}`;
        }
      } while (exists);

      return slug;
    }

    static async findBySlug(slug) {
      return await this.findOne({ where: { slug } });
    }

    static associate(models) {
      this.belongsTo(models.Category, { foreignKey: "category_id", targetKey: "id" });
    }

    static init() {
      super.init(this.model(), {
        sequelize,
        underscored: true,
        hooks: {
          afterUpdate: async (instance /* options */) => {
            console.log("Product updated", instance);
          },
        },
      });
    }

    static schema() {
      return super.schema(DataTypes);
    }

    static model() {
      return {
        ...super.model(DataTypes),
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [1, 255],
          },
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true,
            len: [1, 255],
          },
          async set(value) {
            this.setDataValue("slug", slugify(value));
          },
        },
        categoryId: {
          type: DataTypes.UUID,
          field: "category_id",
          references: {
            model: "categories",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        description: {
          type: DataTypes.TEXT,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
          },
        },
        tax: {
          type: DataTypes.DECIMAL(4, 3),
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
          },
          set(value) {
            this.setDataValue("tax", value > 1 ? value / 100 : value);
          },
        },
        stockReal: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          field: "stock_real",
        },
        stockVirtual: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          field: "stock_virtual",
        },
        image: {
          type: DataTypes.STRING,
        },
        alert: {
          type: DataTypes.INTEGER,
        },
        status: {
          type: DataTypes.INTEGER,
          defaultValue: this.STATUS_DRAFT,
          validate: {
            isIn: [[this.STATUS_DRAFT, this.STATUS_PUBLISHED]],
          },
        },
      };
    }
  }

  Product.init();

  exports.Product = Product;

  return Product;
};
