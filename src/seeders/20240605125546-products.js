"use strict";

const { slugify } = require("../lib/helpers");
const { Product, Category } = require("../models");
const { fakerFR: faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    const productStatus = [Product.STATUS_DRAFT, Product.STATUS_PUBLISHED];
    const categories = await Category.findAll({ attributes: ["id"] });

    const productData = [
      ...Array.from({ length: 100 }, () => {
        return {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          status: productStatus[faker.number.int({ min: 0, max: productStatus.length - 1 })],
          category_id: categories[faker.number.int({ min: 0, max: categories.length - 1 })].id,
          price: faker.commerce.price(),
          stockReal: faker.number.int({ min: 0, max: 100 }),
          stockVirtual: faker.number.int({ min: 0, max: 100 }),
          image: faker.image.url(),
        };
      }),
    ];

    for (const categ of productData) {
      categ.slug = slugify(categ.name);
      console.log("Product created: %s", categ.name);
      await Product.create(categ);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(Product.tableName, null, {});
  },
};
