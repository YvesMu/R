const { Return } = require("../../lib");
const { generateAccessToken } = require("../../lib/authentication");
const { User } = require("../../models");

class AuthService {
  static async login(email, password) {
    return await Return.from(User.login(email, password));
  }

  static async register({ email, password, firstname, lastname, role }) {
    return await Return.from(User.create({ email, password, firstname, lastname, role }), undefined, 201);
  }

  static async refreshAccessToken(id, data) {
    const user = await User.findByPk(id);
    if (!user) {
      return Return.error({ message: "User not found", code: 404 }, 404);
    }
    const accessToken = generateAccessToken(data);
    return Return.success({ accessToken });
  }
}

module.exports = AuthService;
