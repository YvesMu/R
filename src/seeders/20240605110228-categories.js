"use strict";

const { slugify } = require("../lib/helpers");
const { Category } = require("../models");
const { fakerFR: faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    const categoryStatus = [Category.STATUS_DRAFT, Category.STATUS_PUBLISHED];

    const categoryData = [
      ...Array.from({ length: 10 }, () => {
        return {
          name: faker.commerce.department(),
          description: faker.commerce.productDescription(),
          status: categoryStatus[faker.number.int({ min: 0, max: categoryStatus.length - 1 })],
        };
      }),
    ];

    for (const categ of categoryData) {
      categ.slug = slugify(categ.name);
      console.log("Category created: %s", categ.name);
      await Category.create(categ);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(Category.tableName, null, {});
  },
};
