const BaseModel = require("./_base");
const { Product } = require("./product");

module.exports = (sequelize, DataTypes) => {
  class OrderLine extends BaseModel {
    async getProduct() {
      return await Product.findByPk(this.productId);
    }

    static associate(models) {
      this.belongsTo(models.Order, { foreignKey: "order_id" });
      this.belongsTo(models.Product, { foreignKey: "product_id" });
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
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            min: 1,
          },
        },
        orderId: {
          type: DataTypes.UUID,
          field: "order_id",
          references: {
            model: "orders",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        productId: {
          type: DataTypes.UUID,
          field: "product_id",
          references: {
            model: "products",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
      };
    }
  }

  OrderLine.init();

  exports.OrderLine = OrderLine;

  return OrderLine;
};
