const { mongodb } = require("../database");
const BaseModel = require("./_base");
const { OrderLine } = require("../models");

module.exports = (sequelize, DataTypes) => {
  class Order extends BaseModel {
    static STATUS_DRAFT = 0;
    static STATUS_VALIDATED = 1;

    async getLines(withProduct = false) {
      const lines = await OrderLine.findAll({ where: { orderId: this.id } });
      if (withProduct) {
        return await Promise.all(
          lines.map(async (line) => {
            line.product = await line.getProduct();
            return line;
          }),
        );
      }
      return lines;
    }

    async getFullData() {
      const lines = await this.getLines(true);
      return {
        ...this.toJSON(),
        lines,
      };
    }

    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.hasMany(models.OrderLine, { foreignKey: "order_id" });
    }
    static async aze() {
      return { foo: "bar" };
    }

    static init() {
      super.init(this.model(), {
        sequelize,
        underscored: true,
        hooks: {
          afterUpdate: async (instance /* options */) => {
            console.log({ instance, mongodb });
            // const deletion = mongodb.models.mongoOrder.deleteOne({ _id: instance.id });
            // const mongoOrderData = instance.getFullData();
            // Promise.allSettled([deletion, mongoOrderData]).then(async (_, mongoOrderData) => {
            //   mongodb.models.mongoOrder.create(mongoOrderData);
            // });
          },
          afterCreate: async (/* instance */
          /* options */) => {
            console.log("afterCreate");
            //   const mongoOrderData = instance.getFullData();
            //   mongodb.models.mongoOrder.create(mongoOrderData);
          },
          afterDestroy: async (instance /* options */) => {
            mongodb.models.mongoOrder.deleteOne({ _id: instance.id });
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
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
          },
        },
        userId: {
          type: DataTypes.UUID,
          field: "user_id",
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        status: {
          type: DataTypes.INTEGER,
          defaultValue: this.STATUS_DRAFT,
          validate: {
            isIn: [[this.STATUS_DRAFT, this.STATUS_VALIDATED]],
          },
        },
      };
    }
  }

  Order.init();

  exports.Order = Order;

  return Order;
};
