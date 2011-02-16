"use strict";

const { Product } = require("../src/models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Product.tableName, Product.schema());
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(Product.tableName, { cascade: true });
  },
};
