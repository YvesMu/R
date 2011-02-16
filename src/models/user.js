"use strict";

const { PASSWORD_REGEX, ROLES } = require("../../config");
const { Return } = require("../lib");
const BaseModel = require("./_base");

module.exports = (sequelize, DataTypes) => {
  class User extends BaseModel {
    static hash(value, salt = null) {
      return this.sequelize.fn("crypt", value, salt || this.sequelize.fn("gen_salt", "bf"));
    }

    /**
     * @param {string} email
     * @param {string} password
     *
     * @returns {Promise<Return>}
     */
    static async login(email, password) {
      const user = (
        await this.findOne({ where: { email, password: this.hash(password, this.sequelize.col("password")) } })
      ).toJSON();
      return (await Return.from(user, 404)).data;
    }

    static async create(user = undefined, options = undefined) {
      if (user && user.password) {
        if (!user.password.match(PASSWORD_REGEX)) {
          throw new Error("Password does not match the required pattern.");
        }
      }
      return super.create(user, { returing: true, ...options });
    }

    static init() {
      super.init(this.model(), { sequelize, underscored: true });
    }

    static schema() {
      return super.schema(DataTypes);
    }

    static associate(models) {} // eslint-disable-line

    static model() {
      return {
        ...super.model(DataTypes),
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
            min: 5,
            max: 254,
          },
          set(value) {
            this.setDataValue("email", value.toLowerCase().trim());
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: PASSWORD_REGEX,
          },
          get() {
            return undefined;
          },
          set(value) {
            this.setDataValue("password", User.hash(value));
          },
        },
        apikey: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          unique: true,
        },
        firstname: {
          type: DataTypes.STRING,
        },
        lastname: {
          type: DataTypes.STRING,
        },
        fullname: {
          type: DataTypes.VIRTUAL,
          get() {
            return [this.firstname, this.lastname].filter(Boolean).join(" ");
          },
        },
        role: {
          type: DataTypes.STRING,
          defaultValue: ROLES.user,
          validate: {
            isIn: [Object.values(ROLES)],
          },
        },
      };
    }
  }

  User.init();

  exports.User = User;

  return User;
};
