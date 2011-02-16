const { mongoUser } = require("../../database/mongodb/models");
const { Return } = require("../../lib");
const { User } = require("../../models");

class UserService {
  static async getUserInfo(id) {
    return await Return.from(User.findByPk(id));
  }

  static async addUser(user) {
    const newUser = await User.create(user);
    await mongoUser.create(newUser.toJSON());
    return await Return.from(newUser, 422, 201);
  }

  static async getUsers() {
    return await Return.from(User.findAll());
  }

  static async getUser(id) {
    return await Return.from(User.findByPk(id));
  }

  static async updateUser(id, data) {
    await User.update(data, { where: { id } });
    const user = await User.findByPk(id);
    await mongoUser.deleteOne({ id });
    await mongoUser.create(user.toJSON());
    return await Return.from("", 422, 200);
  }

  static async deleteUser(id) {
    await User.destroy({ where: { id } });
    await mongoUser.deleteOne({ id });
    return await Return.from("", 400, 204);
  }

  static async getDashboardUsers() {
    // get users in groups by year of 'createdAt'
    return await Return.from(
      mongoUser.aggregate([
        {
          $group: {
            _id: { $year: "$createdAt" },
            count: { $sum: 1 },
          },
        },
      ]),
    );
  }
}

module.exports = UserService;
