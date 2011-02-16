const { checkProps } = require("../../lib/helpers");
const UserService = require("./service");

class UserController {
  static async getUserInfo(req, res) {
    const { code, data } = await UserService.getUserInfo(req.user.id);
    return res.status(code).send(data);
  }

  static async createUser(req, res) {
    const check = checkProps(req.body, ["email", "password"]);
    if (!check.ok) return res.status(check.code).send(check.data);

    const { email, password, firstname, lastname, role } = req.body;
    const { code, data } = await UserService.addUser({ email, password, firstname, lastname, role });
    return res.status(code).send(data);
  }

  static async getUsers(_, res) {
    const { code, data } = await UserService.getUsers();
    return res.status(code).send(data);
  }

  static async getUser(req, res) {
    const check = checkProps(req.params, ["id"]);
    if (!check.ok) return res.status(check.code).send(check.data);

    const { id } = req.params;
    const { code, data } = await UserService.getUser(id);
    return res.status(code).send(data);
  }

  static async updateUser(req, res) {
    const { firstname, lastname } = req.body;
    const updateData = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    const { code, data } = await UserService.updateUser(req.params.id, updateData);
    return res.status(code).send(data);
  }

  static async deleteUser(req, res) {
    const check = checkProps(req.params, ["id"]);
    if (!check.ok) return res.status(check.code).send(check.data);

    const { id } = req.params;
    const { code, data } = await UserService.deleteUser(id);
    return res.status(code).send(data);
  }

  static async getDashboardUsers(req, res) {
    const { code, data } = await UserService.getDashboardUsers();
    return res.status(code).send(data);
  }
}

module.exports = UserController;
