const { Op } = require("sequelize");
const { slugify } = require("../lib/helpers");
const BaseModel = require("./_base");

module.exports = (sequelize, DataTypes) => {
  class Category extends BaseModel {
    static STATUS_DRAFT = 0;
    static STATUS_PUBLISHED = 1;

    static async create(category = undefined, options = undefined) {
      if (category && category.name) {
        category.name = category.name.trim();
        category.slug = await this.setSlug(category.name);
      }
      return super.create(category, { returing: true, ...options });
    }

    static async update(category = undefined, options = undefined) {
      if (category && category.name) {
        category.name = category.name.trim();
        category.slug = await this.setSlug(category.name);
      }
      return super.update(category, { returing: true, ...options });
    }

    static async setSlug(from) {
      let baseSlug = slugify(from);
      let slug = baseSlug;
      let count = 0;
      let exists = true;

      const categoriesWithSameSlug = await this.findAll({ where: { slug: { [Op.like]: `${baseSlug}%` } } });

      do {
        const existing = categoriesWithSameSlug.find((c) => c.slug === slug);
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
      this.hasMany(models.Product, { foreignKey: "category_id", sourceKey: "id" });
    }

    static init() {
      super.init(this.model(), { sequelize, underscored: true });
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
        description: {
          type: DataTypes.TEXT,
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

  Category.init();

  exports.Category = Category;

  return Category;
};
