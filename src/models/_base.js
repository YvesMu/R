const { Model } = require("sequelize");

class BaseModel extends Model {
  static model(DataTypes) {
    return {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: "updated_at",
      },
      deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
        field: "deleted_at",
      },
    };
  }

  static schema(DataTypes) {
    return Object.entries(this.model(DataTypes)).reduce(
      (acc, [fieldName, fieldOptions]) => (
        fieldOptions.type !== DataTypes.VIRTUAL && (acc[fieldName] = fieldOptions), acc
      ),
      {},
    );
  }
}

module.exports = BaseModel;
