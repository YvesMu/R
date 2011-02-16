"use strict";

const { Order, OrderLine } = require("../src/models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Order.tableName, Order.schema());
    await queryInterface.createTable(OrderLine.tableName, OrderLine.schema());
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(Order.tableName, { cascade: true });
    await queryInterface.dropTable(OrderLine.tableName, { cascade: true });
  },
};
