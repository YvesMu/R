"use strict";

const { User } = require("../src/models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
    await queryInterface.createTable(User.tableName, User.schema());
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query("DROP EXTENSION IF EXISTS pgcrypto;");
    await queryInterface.dropTable(User.tableName, { cascade: true });
  },
};
