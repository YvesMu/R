"use strict";

const { ROLES } = require("../../config");
const { User } = require("../models");
const { fakerFR: faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const basePass = "pass";

    const userData = [
      {
        email: "admin@admin.com",
        password: basePass,
        role: ROLES.admin,
      },
      {
        email: "accountant@accountant.com",
        password: basePass,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        role: ROLES.accountant,
      },
      {
        email: "user@user.com",
        password: basePass,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
      },
      ...Array.from({ length: 10 }, () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        return {
          password: faker.internet.password({ length: 12, pattern: /[^\s]/ }),
          email: faker.internet.email({ firstName, lastName }),
          firstname: firstName,
          lastname: lastName,
        };
      }),
    ];

    const users = [];

    for (const user of userData) {
      const dbUser = User.build(user);
      delete dbUser.fullname;
      dbUser.set(
        "password",
        await queryInterface.sequelize
          .query(`SELECT crypt($1, gen_salt('bf'));`, { bind: [user.password] })
          .then((r) => r[0][0].crypt),
        { raw: true },
      );
      const {
        id,
        createdAt: created_at,
        updatedAt: updated_at,
        deletedAt: deleted_at,
        email,
        apikey,
        password,
        role,
        firstname,
        lastname,
      } = dbUser.dataValues;
      users.push({ id, created_at, updated_at, deleted_at, email, apikey, password, role, firstname, lastname });
      console.log("User created: %s - %s", email, user.password);
    }

    await queryInterface.bulkInsert(User.tableName, users, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(User.tableName, null, {});
  },
};
