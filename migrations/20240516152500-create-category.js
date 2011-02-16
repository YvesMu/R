"use strict";

const { Category } = require("../src/models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(Category.tableName, Category.schema());
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(Category.tableName, { cascade: true });
  },
};
