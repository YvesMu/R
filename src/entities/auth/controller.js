const { checkProps } = require("../../lib/helpers");
const { generateAccessToken, generateRefreshToken } = require("../../lib/authentication");
const AuthService = require("./service");

class AuthController {
  static async login(req, res) {
    // console.log("AuthController -> login -> req.body", req.body);
    const check = checkProps(req.body, ["email", "password"]);
    if (!check.ok) return res.status(check.code).send(check.data);

    const { email, password } = req.body;
    const { code, data } = await AuthService.login(email, password);
    const tokenData = { id: data.id, email: data.email, role: data.role };

    data.accessToken = generateAccessToken(tokenData);
    data.refreshToken = generateRefreshToken(tokenData);

    // console.log("AuthController -> login -> data", data);

    return res.status(code).send(data);
  }

  static async register(req, res) {
    const { email, password, firstname, lastname, role } = req.body;
    const { code, data } = await AuthService.register({ email, password, firstname, lastname, role });
    return res.status(code).send(data);
  }

  static async refresh(req, res) {
    const {
      user: { id, email, role },
    } = req;
    const { code, data } = await AuthService.refreshAccessToken(id, { id, email, role });
    return res.status(code).send(data);
  }

  static async me(req, res) {
    return res.status(200).send(req.user);
  }
}

module.exports = AuthController;
